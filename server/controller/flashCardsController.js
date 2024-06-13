const { default: mongoose } = require("mongoose");
const { Student_Model } = require("../models/Students");

let reviewsToday = 30;
let currentDate = new Date();
let today = currentDate.toISOString().slice(0, 10);

const reviewList = async (req, res) => {
  const { id } = req.params;

  try {
    const student = await Student_Model.findById(id);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const reviewsDoneTodayCount = student.flashcardsDailyReviews.filter(
      (review) => new Date(review.date).toISOString().slice(0, 10) === today
    ).length;

    const remainingFlashcardsToReview = reviewsToday - reviewsDoneTodayCount;

    if (remainingFlashcardsToReview <= 0) {
      return res.status(200).json({
        message: "Success",
        dueFlashcards: [],
        cardsCount: [],
      });
    }

    let dueFlashcards = student.flashCards.filter((card) => {
      const cardDateString = new Date(card.reviewDate)
        .toISOString()
        .slice(0, 10);
      return cardDateString <= today;
    });

    let futureFlashcards = student.flashCards.filter((card) => {
      const cardDateString = new Date(card.reviewDate)
        .toISOString()
        .slice(0, 10);
      return cardDateString > today;
    });

    futureFlashcards.sort(
      (a, b) => new Date(a.reviewDate) - new Date(b.reviewDate)
    );

    if (dueFlashcards.length < remainingFlashcardsToReview) {
      const needed = remainingFlashcardsToReview - dueFlashcards.length;
      dueFlashcards = dueFlashcards.concat(futureFlashcards.slice(0, needed));
    }

    const deckOrganized = dueFlashcards.sort(
      (a, b) => new Date(a.reviewDate) - new Date(b.reviewDate)
    );

    const limitedDueFlashcards = deckOrganized.slice(
      0,
      remainingFlashcardsToReview
    );

    const newCardsCount = limitedDueFlashcards.filter(
      (card) => card.isNew
    ).length;
    const reviewedCardsCount = limitedDueFlashcards.filter(
      (card) => !card.isNew
    ).length;

    const cardsCount = {
      newCardsCount,
      reviewedCardsCount,
    };

    limitedDueFlashcards.forEach((card) => {
      const currentDateClone = new Date(currentDate);
      card.hard = new Date(
        currentDateClone.setHours(currentDateClone.getHours() + 23)
      );
      card.medium = new Date(
        currentDateClone.setHours(currentDateClone.getHours() + 24 * card.reviewRate * 1.5)
      );
      card.easy = new Date(
        currentDateClone.setHours(currentDateClone.getHours() + 24 * card.reviewRate * 2)
      );

    });

    return res.status(200).json({
      message: "Success",
      dueFlashcards: limitedDueFlashcards,
      cardsCount,
    });
  } catch (error) {
    console.error("Erro ao processar o pedido:", error);
    res.status(500).json({ error: "Erro ao processar o pedido" });
  }
};

const flashcard_reviewCard = async (req, res) => {
  const { id } = req.params;
  const { flashcardId, difficulty } = req.body;

  try {
    const student = await Student_Model.findById(id);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const flashcard = student.flashCards.find(
      (card) => card.id.toString() === flashcardId
    );

    if (!flashcard) {
      return res.status(404).json({ error: "Flashcard not found" });
    }

    let hoursToAdd;
    const currentDateClone = new Date(currentDate); // Clone the current date

    switch (difficulty) {
      case "veryhard":
        flashcard.reviewDate = new Date(
          currentDateClone.setSeconds(currentDateClone.getSeconds() + 30)
        );
        flashcard.reviewRate = 1.1;
        break;
      case "hard":
        flashcard.reviewRate = 1.5;
        hoursToAdd = 23; // 1.5 days to hours
        flashcard.reviewDate = new Date(
          currentDateClone.setHours(currentDateClone.getHours() + hoursToAdd)
        );
        break;
      case "medium":
        flashcard.reviewRate *= 1.5;
        hoursToAdd = flashcard.reviewRate * 24; // reviewRate days to hours
        flashcard.reviewDate = new Date(
          currentDateClone.setHours(currentDateClone.getHours() + hoursToAdd)
        );
        break;
      case "easy":
        flashcard.reviewRate *= 2;
        hoursToAdd = flashcard.reviewRate * 24; // reviewRate days to hours
        flashcard.reviewDate = new Date(
          currentDateClone.setHours(currentDateClone.getHours() + hoursToAdd)
        );
        break;
      default:
        return res.status(400).json({ error: "Invalid difficulty level" });
    }

    const reviewsDoneTodayCount = student.flashcardsDailyReviews.filter(
      (review) => review.date.toISOString().slice(0, 10) === today
    ).length;

    const uniqueTimeLineItem = student.scoreTimeline.filter(
      (item) => item.unique == true && item.date == currentDate
    ).length;

    const scoreForDailyReviews = 45;
    let remaining = reviewsToday - 1;

    if (
      difficulty !== "veryhard" &&
      reviewsDoneTodayCount === remaining &&
      uniqueTimeLineItem === 0
    ) {
      student.totalScore += scoreForDailyReviews;
      student.monthlyScore += scoreForDailyReviews;

      const timeline = {
        date: new Date(),
        unique: true,
        score: scoreForDailyReviews,
        description: "Flashcards revisados",
        type: "Anki",
      };

      student.scoreTimeline.push(timeline);
    }

    student.flashCards = student.flashCards.filter(
      (card) => card.id.toString() !== flashcardId
    );
    const newFlashCard = {
      id: new mongoose.Types.ObjectId(),
      front: flashcard.front,
      back: flashcard.back,
      reviewDate: flashcard.reviewDate,
      reviewRate: flashcard.reviewRate,
      numberOfReviews: flashcard.numberOfReviews + 1,
      isNew: false,
    };

    student.flashCards.push(newFlashCard);

    if (difficulty !== "veryhard") {
      student.flashcardsDailyReviews.push({
        date: currentDate,
        card: flashcard.front.text,
      });
    }

    await student.save();

    return res.status(200).json({ message: "Card reviewed", student });
  } catch (error) {
    console.error("Not reviewed:", error);
    return res.status(500).json({ error: "Not reviewed" });
  }
};

const flashcard_createNew = async (req, res) => {
  const { id } = req.params;
  const { newCards } = req.body;
  const student = await Student_Model.findById(id);
  try {
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const newFlashcards = newCards
      .filter((card) => card !== null)
      .map((card, index) => {
        const reviewDate = card.reviewDate
          ? new Date(card.reviewDate)
          : new Date();

        reviewDate.setMinutes(reviewDate.getMinutes() + index);

        return {
          id: new mongoose.Types.ObjectId(),
          front: card.front,
          back: card.back,
          reviewDate: reviewDate,
          reviewRate: card.reviewRate || 1,
          veryhardReviews: card.veryhardReviews || 0,
          hardReviews: card.hardReviews || 0,
          mediumReviews: card.mediumReviews || 0,
          easyReviews: card.easyReviews || 0,
          numberOfReviews: card.numberOfReviews || 0,
          isNew: card.isNew || true,
        };
      });

    student.flashCards.push(...newFlashcards);

    await student.save();
    return res.status(200).json({ message: "Success", newFlashcards });
  } catch (error) {
    console.error("Erro ao processar o pedido:", error);
    res.status(500).json({ error: "Erro ao processar o pedido" });
  }
};

const flashcard_updateOne = async (req, res) => {
  const { id } = req.params;
  const { flashcardId, newFront, newBack } = req.body;

  try {
    const student = await Student_Model.findById(id);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const flashcard = student.flashCards.id(flashcardId);

    if (!flashcard) {
      return res.status(404).json({ error: "Flashcard not found" });
    }

    if (newFront) {
      flashcard.front = { ...flashcard.front, ...newFront };
    }

    if (newBack) {
      flashcard.back = { ...flashcard.back, ...newBack };
    }

    await student.save();

    return res
      .status(200)
      .json({ message: "Flashcard updated successfully", student });
  } catch (error) {
    console.error("Erro ao processar o pedido:", error);
    res.status(500).json({ error: "Erro ao processar o pedido" });
  }
};
const flashcard_deleteCard = async (req, res) => {
  const { id } = req.params;
  const { flashcardId } = req.body;

  try {
    const student = await Student_Model.findById(id);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const flashcard = student.flashCards.id(flashcardId);

    if (!flashcard) {
      return res.status(404).json({ error: "Flashcard not found" });
    }

    await student.save();

    return res
      .status(200)
      .json({ message: "Flashcard deleted successfully", student });
  } catch (error) {
    console.error("Erro ao processar o pedido:", error);
    res.status(500).json({ error: "Erro ao processar o pedido" });
  }
};

module.exports = {
  flashcard_reviewCard,
  flashcard_updateOne,
  flashcard_createNew,
  flashcard_deleteCard,
  reviewList,
};

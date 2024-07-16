const { default: mongoose } = require("mongoose");
const { Student_Model } = require("../models/Students");

let reviewsToday = 50;

const reviewList = async (req, res) => {
  const { id } = req.params;
  let currentDate = new Date();
  let today = currentDate.toISOString().slice(0, 10);

  try {
    const student = await Student_Model.findById(id);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const checkDateBeforeCount = student.flashcardsDailyReviews.filter(
      (review) => new Date(review.date).toISOString().slice(0, 10) === today
    );

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
      remainingFlashcardsToReview,
    };

    limitedDueFlashcards.forEach((card) => {
      const currentDateClone = new Date(currentDate);
      card.hard = new Date(
        currentDateClone.setHours(currentDateClone.getHours() + 10)
      );
      card.medium = new Date(
        currentDateClone.setHours(
          currentDateClone.getHours() + 24 * card.reviewRate * 1.5
        )
      );
      card.easy = new Date(
        currentDateClone.setHours(
          currentDateClone.getHours() + 24 * card.reviewRate * 2
        )
      );
    });

    return res.status(200).json({
      message: "Success",
      dueFlashcards: limitedDueFlashcards,
      cardsCount,
      reviewsToday,
      AAAcurrentDate: currentDate,
      BBBtoday: today,
      CCCrightNow: new Date(),
      remainingFlashcardsToReview,
      checkDateBeforeCount,
    });
  } catch (error) {
    console.error("Erro ao processar o pedido:", error);
    res.status(500).json({ error: "Erro ao processar o pedido" });
  }
};
const flashcard_reviewCard = async (req, res) => {
  const { id } = req.params;
  const { flashcardId, difficulty } = req.body;
  let currentDate = new Date();

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
    const currentDateClone = new Date(currentDate);

    switch (difficulty) {
      case "veryhard":
        flashcard.reviewDate = new Date(
          currentDateClone.setSeconds(currentDateClone.getSeconds() + 30)
        );
        flashcard.reviewRate = 1.1;
        break;
      case "hard":
        flashcard.reviewRate = 1.5;
        hoursToAdd = 24;
        flashcard.reviewDate = new Date(
          currentDateClone.setHours(currentDateClone.getHours() + hoursToAdd)
        );
        break;
      case "medium":
        flashcard.reviewRate *= 1.5;
        hoursToAdd = flashcard.reviewRate * 24;
        flashcard.reviewDate = new Date(
          currentDateClone.setHours(currentDateClone.getHours() + hoursToAdd)
        );
        break;
      case "easy":
        flashcard.reviewRate *= 2;
        hoursToAdd = flashcard.reviewRate * 24;
        flashcard.reviewDate = new Date(
          currentDateClone.setHours(currentDateClone.getHours() + hoursToAdd)
        );
        break;
      default:
        return res.status(400).json({ error: "Invalid difficulty level" });
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
      function adjustDate(currentDate) {
        const date = new Date(currentDate);
        const hours = date.getHours();

        if (hours < 5) {
          date.setDate(date.getDate() - 1);
          date.setHours(20);
          date.setMinutes(0);
          date.setSeconds(0);
          date.setMilliseconds(0);
        }
        return date.toISOString();
      }

      const adjustedDate = adjustDate(currentDate);

      student.flashcardsDailyReviews.push({
        date: adjustedDate,
        card: flashcard.front.text,
      });

      let scoreFor1Card = 5;

      const timelineCard = {
        date: new Date(),
        score: scoreFor1Card,
        description: `${scoreFor1Card} Pontos por ter revisado o flashcard ${flashcard.front.text}`,
        type: "Anki",
      };

      student.totalScore += scoreFor1Card;
      student.monthlyScore += scoreFor1Card;
      student.scoreTimeline.push(timelineCard);
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

    const existingFrontTexts = new Set(
      student.flashCards.map((card) => card.front.text)
    );

    const newFlashcards = newCards
      .filter(
        (card) => card !== null && !existingFrontTexts.has(card.front.text)
      ) 
      .map((card, index) => {
        const reviewDate = card.reviewDate
          ? new Date(card.reviewDate)
          : new Date();
        reviewDate.setMinutes(reviewDate.getMinutes() + index);
        reviewDate.setDate(reviewDate.getDate() - 2);

        return {
          id: new mongoose.Types.ObjectId(),
          front: card.front,
          back: card.back,
          backComments: card.backComments || "",
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

    const newFlashcardsOpposite = newCards
      .filter(
        (card) => card !== null
      ) 
      .map((card, index) => {
        const reviewDate = card.reviewDate
          ? new Date(card.reviewDate)
          : new Date();
        reviewDate.setMinutes(reviewDate.getMinutes() + index);
        reviewDate.setDate(reviewDate.getDate() - 2);
        const reviewFuture = reviewDate.setDate(reviewDate.getDate() +1);

        return {
          id: new mongoose.Types.ObjectId(),
          front: card.back,
          back: card.front,
          backComments: card.backComments || "",
          reviewDate: reviewFuture,
          reviewRate: 2,
          veryhardReviews: card.veryhardReviews || 0,
          hardReviews: card.hardReviews || 0,
          mediumReviews: card.mediumReviews || 0,
          easyReviews: card.easyReviews || 0,
          numberOfReviews: card.numberOfReviews || 0,
          isNew: card.isNew || true,
        };
      });

    student.flashCards.push(...newFlashcards, ...newFlashcardsOpposite);

    await student.save();
    return res.status(200).json({ message: "Success", newFlashcards });
  } catch (error) {
    console.error("Erro ao processar o pedido:", error);
    res.status(500).json({ error: "Erro ao processar o pedido" });
  }
};
const flashcard_getOne = async (req, res) => {
  const { id } = req.params;
  const { cardId } = req.query;

  try {
    const student = await Student_Model.findById(id);

    let foundFlashcard = student.flashCards.find(
      (flashcard) => flashcard.id == cardId
    );

    if (!foundFlashcard) {
      return res.status(404).json({ error: "Flashcard not found" });
    }

    return res.status(200).json({
      message: "Flashcard found successfully",
      flashcard: foundFlashcard,
    });
  } catch (error) {
    console.error("Erro ao processar o pedido:", error);
    return res.status(500).json({ error: "Erro ao processar o pedido" });
  }
};
const flashcard_updateOne = async (req, res) => {

  const { id } = req.params;
  const { cardId } = req.query;
  const { newLGBack, newLGFront, newFront, newBack, newBackComments } =
    req.body;

  try {
    const student = await Student_Model.findById(id);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const flashcardIndex = student.flashCards.findIndex(
      (flashcard) => flashcard.id == cardId
    );

    if (flashcardIndex === -1) {
      return res.status(404).json({ error: "Flashcard not found" });
    }

    const flashcard = student.flashCards[flashcardIndex];

    student.flashCards.splice(flashcardIndex, 1);

    const newFlashcard = {
      id: flashcard.id,
      backComments: newBackComments,
      front: {
        text: newFront || flashcard.front.text,
        language: newLGFront || flashcard.front.language,
      },
      back: {
        text: newBack || flashcard.back.text,
        language: newLGBack || flashcard.back.language,
      },
      reviewDate: flashcard.reviewDate,
      reviewRate: flashcard.reviewRate,
      numberOfReviews: flashcard.numberOfReviews,
      isNew: flashcard.isNew,
    };

    student.flashCards.push(newFlashcard);

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
  const { cardId } = req.query;

  try {
    const student = await Student_Model.findById(id);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const flashcardIndex = student.flashCards.findIndex(
      (flashcard) => flashcard.id == cardId
    );

    if (flashcardIndex === -1) {
      return res.status(404).json({ error: "Flashcard not found" });
    }

    student.flashCards.splice(flashcardIndex, 1);

    await student.save();

    return res
      .status(200)
      .json({ message: "Flashcard deleted successfully", student });
  } catch (error) {
    console.error("Erro ao processar o pedido:", error);
    res.status(500).json({ error: "Erro ao processar o pedido" });
  }
};
const allCardsList = async (req, res) => {
  let currentDate = new Date();
  let today = currentDate.toISOString().slice(0, 10);

  const { id } = req.params;

  try {
    const student = await Student_Model.findById(id);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    let allFlashCards = student.flashCards;

    allFlashCards.sort(
      (a, b) => new Date(a.reviewDate) - new Date(b.reviewDate)
    );

    return res.status(200).json({ message: "Success", allFlashCards });
  } catch (error) {
    console.error("Erro ao processar o pedido:", error);
    res.status(500).json({ error: "Erro ao processar o pedido" });
  }
};

module.exports = {
  flashcard_reviewCard,
  flashcard_updateOne,
  flashcard_createNew,
  flashcard_getOne,
  flashcard_deleteCard,
  reviewList,
  allCardsList,
};

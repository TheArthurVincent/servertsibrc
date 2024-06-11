const { default: mongoose } = require("mongoose");
const { Student_Model } = require("../models/Students");

const reviewList = async (req, res) => {
  const { id } = req.params;

  try {
    const student = await Student_Model.findById(id);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const currentDate = new Date();
    const dueFlashcards = student.flashCards.filter(card => new Date(card.reviewDate) <= currentDate);

    const newCardsCount = dueFlashcards.filter(card => card.isNew).length;
    const reviewedCardsCount = dueFlashcards.filter(card => !card.isNew).length;

    const cardsCount = {
      newCardsCount,
      reviewedCardsCount
    }

    return res.status(200).json({ message: "Success", dueFlashcards, cardsCount });

  } catch (error) {
    console.error("Erro ao processar o pedido:", error);
    res.status(500).json({ error: "Erro ao processar o pedido" });
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

    const newFlashcards = newCards.map(card => ({
      id: new mongoose.Types.ObjectId(),
      front: card.front,
      back: card.back,
      reviewDate: new Date(),
      reviewRate: 1,
      isNew: true,
    }));

    student.flashCards.push(...newFlashcards);

    await student.save();
    return res.status(200).json({ message: "Success", student });
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

    return res.status(200).json({ message: "Flashcard updated successfully", student });

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

    const flashcard = student.flashCards.find(card => card.id.toString() === flashcardId);


    if (!flashcard) {
      return res.status(404).json({ error: "Flashcard not found" });
    }

    const currentDate = new Date();

    switch (difficulty) {
      case "veryhard":
        flashcard.reviewDate = currentDate;
        flashcard.reviewRate = 1;
        break;
      case "hard":
        flashcard.reviewRate = 1.5;
        flashcard.reviewDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
        break;
      case "medium":
        flashcard.reviewRate *= 1.5;
        flashcard.reviewDate = new Date(currentDate.setDate(currentDate.getDate() + Math.ceil(flashcard.reviewRate)));
        break;
      case "easy":
        flashcard.reviewRate *= 3;
        flashcard.reviewDate = new Date(currentDate.setDate(currentDate.getDate() + Math.ceil(flashcard.reviewRate)));
        break;
      default:
        return res.status(400).json({ error: "Invalid difficulty level" });
    }

    const newFlashCard = {
      id: new mongoose.Types.ObjectId(),
      front: flashcard.front,
      back: flashcard.back,
      reviewDate: flashcard.reviewDate,
      reviewRate: flashcard.reviewRate,
      isNew: false,
    }

    student.flashCards.push(newFlashCard);

    if (difficulty !== "veryhard") {
      const timeline = {
        date: new Date(),
        score: 1,
        description: "Card Revisado",
        type: "Anki",
      };
      student.scoreTimeline.push(timeline);
      student.flashcardsDailyReviews.push({
        date: new Date(),
        card: flashcard.front.text,
      });
      student.totalScore += 1;
      student.monthlyScore += 1;
    }

    student.flashCards = student.flashCards.filter(card => card.id.toString() !== flashcardId);

    await student.save();

    return res.status(200).json({ message: "Flashcard difficulty updated successfully", student });

  } catch (error) {
    console.error("Erro ao processar o pedido:", error);
    return res.status(500).json({ error: "Erro ao processar o pedido" });
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


    return res.status(200).json({ message: "Flashcard deleted successfully", student });

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
  reviewList
};

import { Request, Response } from "express";
import mongoose from "mongoose";
import { Events_Model } from "../models/Events";
import { Student_Model } from "../models/Students";

const event_New = async (req: Request, res: Response) => {
  const { studentID, link, date, time, category, description } = req.body;

  try {
    if (!link || !date || !category) {
      res.status(500).json({ Erro: "Informações faltantes" });
    } else {
      const student = await Student_Model.findById(studentID);
      const newEvent = new Events_Model({
        studentID,
        student: student ? `${student.name} ${student.lastname}` : null,
        description,
        link,
        date,
        time,
        category,
      });

      await newEvent.save();

      res.status(200).json({
        message: "Aula marcada",
        newEvent,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ Erro: "Evento não registrado" });
  }
};

const events_seeAll = async (req: Request, res: Response) => {
  const { id } = req.params;

  const filtrarEventos = (eventsList: any[]): any[] => {
    const hoje = new Date();
    const ontem = new Date(hoje);
    ontem.setDate(hoje.getDate() - 1);
    const limite = new Date(hoje);
    limite.setDate(hoje.getDate() + 15);

    const eventosFiltrados = eventsList.filter((evento) => {
      const dataEvento = new Date(evento.date);
      return dataEvento >= ontem && dataEvento <= limite;
    });

    return eventosFiltrados;
  };

  try {
    const student = await Student_Model.findById(id);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    if (student.permissions === "superadmin") {
      const events = await Events_Model.find();
      const eventsList = events.map((event) => {
        const [year, month, day] = event.date.split("-").map(Number);
        const dateObject = new Date(year, month - 1, day);
        const dateString = dateObject.toISOString().slice(0, 10);
        event.date = dateString;
        return event;
      });

      const events31 = filtrarEventos(eventsList);
      return res.status(200).json({ eventsList: events31 });
    } else {
      const events = await Events_Model.find({
        $or: [
          { category: "Group Class" },
          {
            $and: [
              { studentID: id },
              { category: { $in: ["Tutoring", "Rep", "Prize Class"] } },
            ],
          },
        ],
      });
      const eventsList = events.map((event) => {
        const [year, month, day] = event.date.split("-").map(Number);
        const dateObject = new Date(year, month - 1, day);
        const dateString = dateObject.toISOString().slice(0, 10);
        event.date = dateString;
        return event;
      });
      const events31 = filtrarEventos(eventsList);
      return res.status(200).json({ eventsList: events31 });
    }
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { event_New, events_seeAll };

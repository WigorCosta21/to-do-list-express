const express = require("express");

const router = express.Router();

const CheckList = require("../models/checklist");

router.get("/", async (req, res) => {
  try {
    let checklist = await CheckList.find({});
    res.status(200).render("checklists/index", { checklist: checklist });
  } catch (error) {
    res
      .status(200)
      .render("pages/error", { error: "Erro ao exibir as listas" });
  }
});

router.get("/new", async (req, res) => {
  try {
    let checklist = new CheckList();
    res.status(200).render("checklists/new", { checklist: checklist });
  } catch (error) {
    res
      .status(500)
      .render("pages/error", { error: "Erro ao carregar o formulário" });
  }
});

router.get("/:id/edit", async (req, res) => {
  try {
    let checklist = await CheckList.findById(req.params.id);
    res.status(200).render("checklists/edit", { checklist: checklist });
  } catch (error) {
    res.status(500).render("pages/error", {
      error: "Erro ao exibir a ediçãode lista de tarefas",
    });
  }
});

router.post("/", async (req, res) => {
  let { name } = req.body.checklist;
  let checklist = new CheckList({ name });

  try {
    await checklist.save();
    res.redirect("/checklists");
  } catch (error) {
    res
      .status(422)
      .render("checklists/new", { checklist: { ...checklist, error } });
  }
});

router.get("/:id", async (req, res) => {
  try {
    let checklist = await CheckList.findById(req.params.id).populate("tasks");
    res.status(200).render("checklists/show", { checklist: checklist });
  } catch (error) {
    res
      .status(500)
      .render("pages/error", { error: "Erro ao exibir as listas de tarefa" });
  }
});

router.put("/:id", async (req, res) => {
  let { name } = req.body.checklist;
  let checklist = await CheckList.findById(req.params.id);

  try {
    await checklist.update({ name });
    res.redirect("/checklists");
  } catch (error) {
    let errors = error.erros;
    res
      .status(402)
      .render("checklists/edit", { checklist: { ...checklist, errors } });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    let checklist = await CheckList.findByIdAndRemove(req.params.id);
    res.redirect("/checklists");
  } catch (error) {
    res
      .status(500)
      .render("pages/error", { error: "Erro ao deletar listas de tarefa" });
  }
});

module.exports = router;

const { Material_Model } = require("../models/Material");

const material_getAll = async (req, res) => {
  try {
    const materialList = await Material_Model.find();
    const groupedMaterials = materialList.reduce((acc, material) => {
      if (!acc[material.category]) {
        acc[material.category] = [];
      }
      acc[material.category].push({
        title: material.title,
        link: material.link,
        img: material.img,
      });
      return acc;
    }, {});

    const formattedMaterialData = {
      basicClasses: groupedMaterials["basicClasses"] || [],
      intermediateClasses: groupedMaterials["intermediateClasses"] || [],
      advancedClasses: groupedMaterials["advancedClasses"] || [],
      thematicClasses: groupedMaterials["thematicClasses"] || [],
    };

    res.json(formattedMaterialData);
  } catch {
    res.status(500).json({ Erro: "Material não registrado", error });
  }
};

const material_postNew = async (req, res) => {
  const { title, img, link, category } = req.body;
  try {
    if (!title || !link || !category) {
      return res.status(404).json({ message: "Informações Faltantes" });
    }

    const existingMaterial = await Material_Model.findOne({
      $or: [{ title: title }, { link: link }],
    });

    if (existingMaterial) {
      return res
        .status(400)
        .json({ message: "Título ou link já estão em uso" });
    }

    const newMaterial = new Material_Model({
      title,
      img,
      link,
      category,
    });
    await newMaterial.save();
  } catch {
    res.status(500).json({ Erro: "Material não registrado", error });
  }
};

const material_deleteOne = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res.status(404).json({ message: "Informações Faltantes" });
    }

    const materialToDelete = await Material_Model.findById(id);

    if (!materialToDelete) {
      return res.status(400).json({ message: "Material não existe" });
    }

    await materialToDelete.deleteOne();
  } catch {
    res.status(500).json({ Erro: "Material não excluído", error });
  }
};

const material_editOne = async (req, res) => {
  const { id } = req.params;
  const { title, img, link, category } = req.body;
  try {
    if (!id) {
      return res.status(404).json({ message: "Informações Faltantes" });
    }

    const materialToEdit = await Material_Model.findById(id);

    if (!materialToEdit) {
      return res.status(400).json({ message: "Material não existe" });
    }
    title && (materialToEdit.title = title);
    img && (materialToEdit.img = img);
    link && (materialToEdit.link = link);
    category && (materialToEdit.category = category);

    await materialToEdit.save();
  } catch {
    res.status(500).json({ Erro: "Material não editado", error });
  }
};

module.exports = {
  //C
  material_postNew,
  //R
  material_getAll,
  //U
  material_editOne,
  //D
  material_deleteOne,
};

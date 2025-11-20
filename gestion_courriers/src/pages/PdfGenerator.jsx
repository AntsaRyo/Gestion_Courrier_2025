import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logoPlaceholder from "../assets/mef.png"; // logo par défaut
import logoCenter from "../assets/saina.png"; // logo par défaut

export const generateBordereauPdf = async ({
  ObjetDepart,
  numero_correspondance_depart,
  DestinataireDepart,
  ObservationsDepart,
  pieces,
  logoDataUrl,
}) => {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();

  //LOGO GAUCHE
  const logo = logoDataUrl || logoPlaceholder;
  const logocenter = logoDataUrl || logoCenter;
  try {
    doc.addImage(logo, "PNG", 90, 90, 65, 60); // addImage(img, format, X, Y, l, h)
  } catch (err) {
    console.warn("Erreur logo :", err);
  }

  //LOGO CENTRÉ EN HAUT
  try {
    doc.addImage(logocenter, "PNG", pageWidth / 2 - 45, 15, 100, 80);
  } catch (err) {
    console.warn("Erreur logo centré :", err);
  }

  //TEXTE MINISTÈRE
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("MINISTERE DE L'ECONOMIE ET DES FINANCES", 30, 110);
  doc.text("------------", 95, 126);
  doc.text("SECRETARIAT GENERAL", 60, 142);
  doc.text("------------", 95, 158);
  doc.text("DIRECTION GENERALE DES FINANCES", 40, 174);
  doc.text("ET DES AFFAIRES GENERALES", 55, 186);
  doc.text("------------", 95, 198);
  doc.text("DIRECTION DU BUDGET", 60, 212);
  doc.text("------------", 95, 228);
  doc.text("SERVICE REGIONAL DU BUDGET ", 40, 244);
  doc.text("HAUTE MATSIATRA", 65, 256);
  doc.setLineWidth(0.5);
  doc.line(65, 262, pageWidth - 437, 262);

  // DATE
  const today = new Date();
  const year = today.getFullYear();
  const dateStr = today.toLocaleDateString('fr-FR' , {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
  doc.text(`Fianarantsoa, le ${dateStr}`, pageWidth - 210, 110);

  //CHEF DU SERVICE avant destinataire
  doc.setFontSize(11);
  doc.setFont("helvetica");
  doc.text("LE CHEF DU SERVICE REGIONAL DU BUDGET", pageWidth - 270, 130);
  doc.text("HAUTE MATSIATRA", pageWidth - 210, 146);
  doc.text("à", pageWidth - 160, 172);

  // DESTINATAIRE sous “à”
  const destinataireMaxWidth = 200;
  const destinataireLines = doc.splitTextToSize(DestinataireDepart || "-", destinataireMaxWidth);
  doc.setFont("helvetica", "normal");
  doc.text(destinataireLines || "-", pageWidth - 230, 200);

  // FIANARANTSOA souligné
  doc.setFont("helvetica", "underline");
  doc.setLineWidth(0.5);
  doc.line(pageWidth - 152, 250, pageWidth - 65, 250);
  doc.text("« FIANARANTSOA »", pageWidth - 160, 248);

  // INFORMATIONS GÉNÉRALES
  const infoY = 320;

  // TITRE ET NUMÉRO
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  const numeroTexte = `N°${numero_correspondance_depart || "____"}/${year}-MEF/SG/DGFAG/DB/SRB-HM`;
  doc.text(numeroTexte, 30, infoY + 10);

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("BORDEREAU D'ENVOI", pageWidth / 2, infoY + 50, { align: "center" });

  // TABLEAU DES PIÈCES 
  const rows =
    pieces.length > 0
      ? pieces.map((p, idx) => ({
          designation: p.designation || `Pièce jointe ${idx + 1}`,
          nombre: p.nombre || "01",
          observations: "",
        }))
      : [{ designation: "Aucune pièce jointe", nombre: "-", observations: "-" }];

  // Objet en première ligne
  rows.unshift({
    designation: ObjetDepart ? ObjetDepart : "(Objet non précisé)",
    nombre: "01",
    observations: "",
  });
  
  rows.splice(1, 0, {
    designation: "Pièces jointes: ",
    nombre: "",
    observations:"« " + ObservationsDepart.toUpperCase() + " »" || "-",
  });

  const startY = infoY + 75;

  // TABLEAU AVEC BORDURES EXTÉRIEURES UNIQUEMENT
autoTable(doc, {
  startY,
  margin: { left: 23, right: 36 },
  styles: {
    font: "helvetica",
    fontSize: 10,
    lineColor: [100, 100, 100],
    lineWidth: 0.3,
  },
  headStyles: {
    fillColor: [255, 255, 255],
    textColor: 30,
    halign: "center",
    valign: "middle",
    fontStyle: "bold",
  },
  bodyStyles: {
    lineColor: [100, 100, 100],
    lineWidth: 0.3,
    cellPadding: 5,
    textColor: 30,
    valign: "middle",
  },
  theme: "grid",

  // 🔧 Personnalisation des bordures
willDrawCell: function (data) {
  const isLastBodyRow = data.section === "body" &&
                        data.row.index === data.table.body.length - 1;

  if (data.section === "head") {
    data.cell.styles.lineWidth = {
      top: 0.3,
      bottom: 0.3,   // normalement visible mais AutoTable l’efface
      left: 0.3,
      right: 0.3,
    };
  }

  if (data.section === "body") {
    data.cell.styles.lineWidth = {
      top: 0,
      bottom: isLastBodyRow ? 0.3 : 0,
      left: 0.3,
      right: 0.3,
    };
  }
},

// 🔧 Forcer la ligne du bas du head (solution définitive)
didDrawCell: function (data) {
  if (data.section === "head" && data.row.index === data.table.head.length - 1) {
    const doc = data.doc;
    doc.setLineWidth(0.3);
    doc.setDrawColor(100, 100, 100);

    // x1, y1 = début de la bordure
    // x2, y1 = fin de la bordure
    doc.line(
      data.cell.x,
      data.cell.y + data.cell.height,
      data.cell.x + data.cell.width,
      data.cell.y + data.cell.height
    );
  }
},
  columnStyles: {
    0: { cellWidth: 340 },
    1: { cellWidth: 70, halign: "center" },
    2: { cellWidth: 140, halign: "center" },
  },

  head: [
    [
      { content: "DESIGNATION DES PIECES", styles: { halign: "center" } },
      "NOMBRE",
      { content: "OBSERVATIONS", styles: { halign: "center" } },
    ],
  ],

  body: rows.map((r) => [r.designation, r.nombre, r.observations]),
});


  const lefMargin = 30;
  const topMargin = 100;
  doc.setLineWidth(1);
  doc.line(lefMargin, topMargin +670, lefMargin +535, topMargin +670);

  doc.setFontSize(10);
  doc.setFont("sans-cherif", "italic");
  doc.text("Service Régional du Budget Haute Matsiatra", pageWidth /2 , infoY +462, { align: "center" }); 
  doc.text("Tel: 032 11 067 48", pageWidth /2 , infoY +473, { align: "center" });

  // === SAUVEGARDE ===
  doc.save(`bordereau_envoi_${dateStr.replace(/\//g, "-")}.pdf`);
};

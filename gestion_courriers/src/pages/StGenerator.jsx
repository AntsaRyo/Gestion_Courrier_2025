import jsPDF from "jspdf";
import logo from "../assets/saina.png";

export const generateStPdf = async ({ numero_correspondance_depart, DestinataireDepart, ObservationsDepart, ObjetDepart }) => {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();

  // CONFIGURATION DE BASE
  const leftMargin = 30;
  const topMargin = 130;

  //LOGO EN HAUT À GAUCHE
  doc.addImage(logo, "PNG", pageWidth / 2 - 45, topMargin - 100, 130, 80);

  // ENTÊTE MINISTÉRIEL
  doc.setFont("times", "bold");
  doc.setFontSize(10);
  doc.text("SECRETARIAT GENERAL", leftMargin + 32, topMargin + 10);
  doc.text("DIRECTION GENERALE DU BUDGET ET", leftMargin, topMargin + 25);
  doc.text("DES FINANCES", leftMargin + 50, topMargin + 40);
  doc.text("DIRECTION DU BUDGET", leftMargin + 30, topMargin + 55);
  doc.text("SERVICE REGIONAL DU BUDGET", leftMargin + 10, topMargin + 70);
  doc.text("HAUTE MATSIATRA", leftMargin + 40, topMargin + 85);

  // TITRE CENTRAL
  doc.setFont("times", "bold");
  doc.setFontSize(15);
  doc.text("SOIT TRANSMIS", 390, topMargin + 20);

  // SECTION "À" 
  doc.setFont("times", "normal");
  doc.setFontSize(13);
  doc.text("à", 445, topMargin + 50);

  doc.setFont("times", "bold");
  doc.setFontSize(11);
  const destinataireMaxWidth = 200;
  const DestinataireMaj = DestinataireDepart ? DestinataireDepart.toUpperCase() : "-";
  const destinataireLines = doc.splitTextToSize(DestinataireMaj || "-", destinataireMaxWidth);
  doc.text(destinataireLines || "-", leftMargin + 320, topMargin + 80, { maxWidth: 300});

  doc.setFont("times", "normal");
  doc.setFontSize(12);
  doc.text("DIVISION :", 355, topMargin + 140);

  // NUMÉRO
  doc.setFont("times", "bold");
  doc.setFontSize(12);
  doc.text("N° :", leftMargin, topMargin + 165);
  doc.setTextColor(0, 0, 0);
  doc.text(String(numero_correspondance_depart || "____"), leftMargin + 25, topMargin + 165);
  doc.setTextColor(0, 0, 0);
  doc.setFont("times", "normal");
  doc.text("MEF/SG/DGBF/DB/SRB-HM", leftMargin + 45, topMargin + 165);

  // DATE ACTUELLE
  const currentDate = new Date().toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  doc.setFont("times", "normal");
  doc.setLineWidth(0.7); // Épaisseur du trait
  doc.line(leftMargin + 20, topMargin + 204, leftMargin + 45, topMargin + 204);
  doc.text("Date :", leftMargin + 20, topMargin + 200);
  doc.setTextColor(0, 0, 0);
  doc.text(`${currentDate}`, leftMargin + 55, topMargin + 200);
  doc.setTextColor(0, 0, 0);

  // OBJET
  doc.setFont("times", "normal");
  doc.setLineWidth(0.5); // Épaisseur du trait
  doc.line(leftMargin + 20, topMargin + 232, leftMargin + 45, topMargin + 232);
  doc.text("Objet :", leftMargin + 20, topMargin + 230);
  doc.setFont("times", "normal");
  doc.setTextColor(0, 0, 0);
  doc.text(ObjetDepart || "", leftMargin + 60, topMargin + 230, { maxWidth: 420 });
  doc.setTextColor(0, 0, 0);

  // a/n de
  doc.setFont("times", "normal");
  doc.setLineWidth(0.5); // Épaisseur du trait
  doc.line(leftMargin + 20, topMargin + 269, leftMargin + 50, topMargin + 269);
  doc.text("a/n de :", leftMargin + 20, topMargin + 267);
  doc.setFont("times", "normal");
  doc.setTextColor(0, 0, 0);
  doc.text("...............................", leftMargin + 60, topMargin + 265);
  doc.setTextColor(0, 0, 0);

  // OBSERVATION 
  if (ObservationsDepart && ObservationsDepart.trim() !== "") {
  const obsText = "« " + ObservationsDepart.toUpperCase() + " »";

  doc.setTextColor(0, 0, 0);
  doc.setFont("times", "normal");
  doc.setFontSize(12);

  // Coordonnées de départ
  const xText = leftMargin + 300;
  const yText = topMargin + 300;

  // 1) Mesurer la largeur réelle du texte
  const textWidth = doc.getTextWidth(obsText);

  //  2) Tracer une ligne exactement sous le texte
  const yLine = yText + 2; // décalage vertical (2px sous le texte)
  doc.setLineWidth(0.5);
  doc.line(xText, yLine, xText + textWidth, yLine);

  // 3) Afficher le texte
  doc.text(obsText, xText, yText);
}

  // SAUVEGARDE 
  doc.save("ST.pdf");
};

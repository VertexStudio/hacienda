import Phaser from "phaser";
import "./styles.css";

const WIDTH = 1180;
const HEIGHT = 820;
const GUIDE_URL =
  "https://www.transparenciafiscal.gob.sv/downloads/pdf/700-DGP-GA-2025-GPC25.pdf";

type ScreenName = "intro" | "assignment" | "bridge" | "comparison";

type Sector = {
  id: string;
  name: string;
  icon: string;
  official: string;
  citizen: string;
  feedback: string;
  realPercent: number;
  color: number;
};

const sectors: Sector[] = [
  {
    id: "educacion",
    name: "Educación",
    icon: "ED",
    official: "Ministerio de Educación, Ciencia y Tecnología",
    citizen:
      "Recursos para escuelas, formación docente, materiales educativos y oportunidades de aprendizaje.",
    feedback:
      "Aumentar este sector puede mejorar escuelas, formación docente y materiales educativos, pero deja menos recursos para otras áreas.",
    realPercent: 15.9,
    color: 0x2f80ed
  },
  {
    id: "salud",
    name: "Salud",
    icon: "SA",
    official: "Ministerio de Salud",
    citizen:
      "Recursos para hospitales, medicamentos, prevención y atención médica a la población.",
    feedback:
      "Aumentar este sector puede fortalecer hospitales, medicamentos y atención médica, pero reduce recursos disponibles para otras prioridades.",
    realPercent: 12.2,
    color: 0x20a464
  },
  {
    id: "seguridad",
    name: "Seguridad Pública",
    icon: "SP",
    official: "Ministerio de Justicia y Seguridad Pública",
    citizen:
      "Recursos para prevención del delito, seguridad ciudadana y funcionamiento de instituciones de justicia y seguridad.",
    feedback:
      "Aumentar este sector puede fortalecer la prevención del delito y la seguridad ciudadana, pero deja menos presupuesto para otros servicios públicos.",
    realPercent: 6.1,
    color: 0x8b5cf6
  },
  {
    id: "defensa",
    name: "Defensa Nacional",
    icon: "DN",
    official: "Ministerio de la Defensa Nacional",
    citizen:
      "Recursos para proteger la soberanía, apoyar emergencias y mantener capacidades de defensa del país.",
    feedback:
      "Aumentar este sector puede fortalecer la capacidad de defensa del país, pero limita recursos para otras áreas del presupuesto.",
    realPercent: 3.3,
    color: 0x607d8b
  },
  {
    id: "infraestructura",
    name: "Infraestructura y transporte",
    icon: "IT",
    official: "Ministerio de Obras Públicas y de Transporte",
    citizen:
      "Recursos para carreteras, transporte, obras públicas y mantenimiento de infraestructura.",
    feedback:
      "Aumentar este sector puede mejorar carreteras, transporte y obras públicas, pero reduce recursos para otros programas.",
    realPercent: 7.5,
    color: 0xf2994a
  },
  {
    id: "programas",
    name: "Programas sociales y desarrollo",
    icon: "PS",
    official:
      "Ministerios de Trabajo, Cultura, Vivienda, Desarrollo Local, Economía, Agricultura, Medio Ambiente, Turismo y Gobernación.",
    citizen:
      "Recursos para vivienda, empleo, agricultura, cultura, turismo, ambiente y desarrollo territorial.",
    feedback:
      "Aumentar este sector puede apoyar vivienda, agricultura, cultura y desarrollo local, pero deja menos recursos para otras prioridades.",
    realPercent: 6.2,
    color: 0xeb5757
  },
  {
    id: "administracion",
    name: "Administración del Estado",
    icon: "AE",
    official:
      "Presidencia de la República, Ministerio de Hacienda, Relaciones Exteriores, Ministerio Público y otras instituciones.",
    citizen:
      "Recursos para que las instituciones públicas funcionen, planifiquen, atiendan y administren servicios.",
    feedback:
      "Aumentar este sector puede fortalecer el funcionamiento de las instituciones públicas, pero reduce recursos para otras áreas.",
    realPercent: 5.0,
    color: 0x00a6a6
  },
  {
    id: "transferencias",
    name: "Transferencias y obligaciones",
    icon: "TO",
    official: "Obligaciones Generales del Estado; Transferencias Varias",
    citizen:
      "Recursos que el Estado entrega a otras instituciones o compromisos que debe cumplir por ley.",
    feedback:
      "Aumentar este sector permite cumplir compromisos del Estado con otras instituciones, pero reduce recursos disponibles para gasto directo.",
    realPercent: 9.4,
    color: 0xb7791f
  },
  {
    id: "deuda",
    name: "Pago de deuda",
    icon: "PD",
    official: "Pago de deuda pública: intereses y principal",
    citizen:
      "Dinero destinado a pagar préstamos anteriores. Si no se paga ahora, se deberá pagar en próximos años y con intereses.",
    feedback:
      "Aumentar este sector permite cumplir pagos de deuda del país, pero deja menos recursos para programas y servicios públicos.",
    realPercent: 28.8,
    color: 0x4f4f4f
  },
  {
    id: "organos",
    name: "Órganos Legislativo y Judicial",
    icon: "LJ",
    official: "Órgano Legislativo y Órgano Judicial",
    citizen:
      "Instituciones encargadas de elaborar leyes, resolver conflictos y administrar justicia.",
    feedback:
      "Aumentar este sector puede fortalecer la elaboración de leyes y la administración de justicia, pero reduce recursos para otras áreas.",
    realPercent: 5.6,
    color: 0x9b51e0
  }
];

class BudgetSimulatorScene extends Phaser.Scene {
  private screen: ScreenName = "intro";
  private allocations: Record<string, number> = {};
  private infoCard?: Phaser.GameObjects.Container;
  private feedbackText?: Phaser.GameObjects.Text;

  constructor() {
    super("BudgetSimulatorScene");
  }

  create() {
    this.resetAllocations();
    this.renderIntro();
  }

  private resetAllocations() {
    this.allocations = Object.fromEntries(sectors.map((sector) => [sector.id, 0]));
  }

  private totalAssigned() {
    return sectors.reduce((total, sector) => total + this.allocations[sector.id], 0);
  }

  private surplus() {
    return 100 - this.totalAssigned();
  }

  private renderIntro() {
    this.screen = "intro";
    this.clearScreen();
    this.drawBackground();

    this.addText(64, 54, "Diseña el presupuesto del país", 54, "#17211f", 690, "bold");
    this.addText(
      68,
      138,
      "Imagina que eres responsable de decidir cómo se distribuye el presupuesto del país. Deberás asignar recursos a distintas áreas importantes como educación, salud, seguridad e infraestructura.",
      24,
      "#364340",
      700
    );
    this.addText(
      68,
      246,
      "Pero recuerda: los recursos son limitados. Si decides gastar más en un área, habrá menos recursos para otras.",
      24,
      "#364340",
      650
    );
    this.addText(
      68,
      344,
      "Al final podrás comparar tu presupuesto con la forma en que realmente se distribuye el presupuesto del Estado.",
      24,
      "#364340",
      650
    );

    this.drawInfoPanel(780, 118, 320, 250, "Presupuesto 2025", [
      "Presupuesto del Estado de El Salvador",
      "Total: 9,663 millones de dólares",
      "Tu misión: repartir 100% sin generar déficit."
    ]);

    this.drawMiniBudgetGraphic(815, 420);
    this.addButton(68, 620, 260, 62, "Comenzar", () => this.renderAssignment(), "primary");
  }

  private renderAssignment(message?: string) {
    this.screen = "assignment";
    this.clearScreen();
    this.drawBackground();
    this.drawHeader(
      "Tu presupuesto nacional",
      "Asigna recursos a los sectores. Puedes dejar superávit, pero no puedes gastar más del 100%."
    );

    this.drawIndicators(48, 120);
    this.drawAssignmentRows(48, 212);

    const feedback =
      message ??
      "Selecciona un sector y ajusta su porcentaje. Cada decisión cambia el superávit disponible.";
    this.add
      .rectangle(48, 705, 760, 72, 0xffffff, 0.92)
      .setOrigin(0)
      .setStrokeStyle(1, 0xd7ded8);
    this.feedbackText = this.addText(68, 722, feedback, 19, "#364340", 720);
    this.addButton(850, 708, 270, 60, "Ver mi presupuesto", () => this.renderBridge(), "primary");
  }

  private drawAssignmentRows(x: number, y: number) {
    const rowHeight = 46;
    sectors.forEach((sector, index) => {
      const rowY = y + index * rowHeight;
      const fill = index % 2 === 0 ? 0xffffff : 0xf8faf6;
      this.add.rectangle(x, rowY, 1070, 40, fill).setOrigin(0).setStrokeStyle(1, 0xe3e8e4);

      this.add
        .circle(x + 22, rowY + 20, 15, sector.color)
        .setStrokeStyle(2, 0x17211f, 0.12);
      this.addText(x + 13, rowY + 11, sector.icon, 12, "#ffffff", 24, "bold");

      const name = this.addText(x + 50, rowY + 10, sector.name, 17, "#126a70", 310, "bold");
      name.setInteractive({ useHandCursor: true });
      name.on("pointerover", () => this.showInfoCard(sector, x + 368, rowY - 16));
      name.on("pointerout", () => this.hideInfoCard());
      name.on("pointerdown", () => this.showInfoCard(sector, x + 368, rowY - 16, true));
      this.add.rectangle(x + 50, rowY + 31, Math.min(name.width, 260), 2, 0x126a70, 0.22).setOrigin(0);

      this.drawSmallBar(x + 376, rowY + 13, 300, this.allocations[sector.id], sector.color);
      this.addText(x + 700, rowY + 9, `${this.allocations[sector.id]}%`, 20, "#17211f", 60, "bold");
      this.addButton(x + 780, rowY + 4, 42, 32, "-", () => this.adjustSector(sector, -1), "plain");
      this.addButton(x + 832, rowY + 4, 42, 32, "+", () => this.adjustSector(sector, 1), "plain");
      this.addText(x + 908, rowY + 11, `Real 2025: ${sector.realPercent.toFixed(1)}%`, 15, "#51605c", 150);
    });
  }

  private adjustSector(sector: Sector, delta: number) {
    const current = this.allocations[sector.id];
    if (delta > 0 && this.surplus() <= 0) {
      this.renderAssignment("No puedes asignar más presupuesto porque ya no queda superávit disponible.");
      return;
    }
    if (delta < 0 && current <= 0) {
      this.renderAssignment("Ese sector ya está en 0%. Puedes aumentar otra área o avanzar al resultado.");
      return;
    }

    this.allocations[sector.id] = Phaser.Math.Clamp(current + delta, 0, 100);
    this.renderAssignment(sector.feedback);
  }

  private renderBridge() {
    this.screen = "bridge";
    this.clearScreen();
    this.drawBackground();
    this.drawHeader(
      "Cada presupuesto refleja prioridades",
      "Al aumentar recursos en algunas áreas, necesariamente quedan menos recursos disponibles para otras."
    );

    this.drawIndicators(120, 168);
    this.drawInfoPanel(152, 300, 876, 220, "Antes de comparar", [
      "En la siguiente pantalla podrás comparar tus decisiones con el presupuesto real del país.",
      "Observa dónde asignaste más recursos y dónde asignaste menos.",
      "No hay una respuesta única: el objetivo es reflexionar sobre decisiones difíciles."
    ]);

    this.addButton(262, 610, 300, 60, "Volver a ajustar", () => this.renderAssignment(), "secondary");
    this.addButton(
      596,
      610,
      360,
      60,
      "Comparar con el presupuesto real",
      () => this.renderComparison(),
      "primary"
    );
  }

  private renderComparison() {
    this.screen = "comparison";
    this.clearScreen();
    this.drawBackground();
    this.drawHeader(
      "Tu presupuesto vs. el presupuesto real",
      "Compara tus decisiones con la distribución del Presupuesto General del Estado 2025."
    );

    this.addText(48, 112, "Gráfico comparativo", 22, "#17211f", 320, "bold");
    this.drawComparisonChart(48, 150);
    this.drawComparisonTable(724, 112);
    this.drawAnalysis(48, 612);

    this.addButton(48, 744, 240, 52, "Intentar nuevamente", () => {
      this.resetAllocations();
      this.renderIntro();
    }, "secondary");
    this.addButton(314, 744, 350, 52, "Ir a la guía ciudadana 2025", () => {
      window.open(GUIDE_URL, "_blank", "noopener,noreferrer");
    }, "primary");
    this.addButton(690, 744, 190, 52, "Finalizar", () => this.renderIntro(), "plain");
  }

  private drawComparisonChart(x: number, y: number) {
    const maxBar = 100;
    const barWidth = 250;
    const rowHeight = 43;
    this.addText(x + 246, y - 28, "Tu presupuesto", 15, "#126a70", 150, "bold");
    this.addText(x + 492, y - 28, "Real 2025", 15, "#51605c", 130, "bold");

    sectors.forEach((sector, index) => {
      const rowY = y + index * rowHeight;
      const player = this.allocations[sector.id];
      this.addText(x, rowY + 6, sector.name, 15, "#17211f", 216, "bold");
      this.drawBar(x + 228, rowY + 6, barWidth, 11, player / maxBar, sector.color);
      this.drawBar(x + 474, rowY + 22, barWidth, 11, sector.realPercent / maxBar, 0x9aa5a1);
      this.addText(x + 228 + barWidth + 8, rowY - 1, `${player}%`, 13, "#126a70", 42, "bold");
      this.addText(x + 474 + barWidth + 8, rowY + 15, `${sector.realPercent.toFixed(1)}%`, 13, "#51605c", 58);
    });
  }

  private drawComparisonTable(x: number, y: number) {
    this.add
      .rectangle(x, y, 408, 462, 0xffffff, 0.94)
      .setOrigin(0)
      .setStrokeStyle(1, 0xd7ded8);
    this.addText(x + 18, y + 16, "Tabla comparativa", 21, "#17211f", 240, "bold");
    this.addText(x + 18, y + 54, "Área", 13, "#51605c", 150, "bold");
    this.addText(x + 230, y + 54, "Tú", 13, "#51605c", 46, "bold");
    this.addText(x + 310, y + 54, "Real", 13, "#51605c", 58, "bold");

    sectors.forEach((sector, index) => {
      const rowY = y + 80 + index * 31;
      const name = this.addText(x + 18, rowY, sector.name, 12, "#126a70", 190, "bold");
      name.setInteractive({ useHandCursor: true });
      name.on("pointerover", () => this.showInfoCard(sector, x - 260, rowY - 18));
      name.on("pointerout", () => this.hideInfoCard());
      name.on("pointerdown", () => this.showInfoCard(sector, x - 260, rowY - 18, true));
      this.addText(x + 232, rowY, `${this.allocations[sector.id]}%`, 13, "#17211f", 54, "bold");
      this.addText(x + 310, rowY, `${sector.realPercent.toFixed(1)}%`, 13, "#51605c", 58);
    });

    const surplusY = y + 80 + sectors.length * 31 + 8;
    this.add.rectangle(x + 14, surplusY - 8, 380, 1, 0xd7ded8).setOrigin(0);
    this.addText(x + 18, surplusY + 4, "Superávit", 13, "#17211f", 180, "bold");
    this.addText(x + 232, surplusY + 4, `${this.surplus()}%`, 13, "#17211f", 56, "bold");
    this.addText(x + 310, surplusY + 4, "-", 13, "#51605c", 32);
    this.addText(
      x + 18,
      y + 430,
      "Fuente: Ministerio de Hacienda, Guía del Presupuesto General del Estado para el Ciudadano 2025.",
      11,
      "#51605c",
      360
    );
  }

  private drawAnalysis(x: number, y: number) {
    const surplus = this.surplus();
    const over = sectors
      .filter((sector) => this.allocations[sector.id] > sector.realPercent)
      .map((sector) => sector.name);
    const under = sectors
      .filter((sector) => this.allocations[sector.id] < sector.realPercent)
      .map((sector) => sector.name);

    this.add
      .rectangle(x, y, 1084, 112, 0xffffff, 0.94)
      .setOrigin(0)
      .setStrokeStyle(1, 0xd7ded8);

    const surplusMessage =
      surplus > 0
        ? `Has dejado un superávit de ${surplus}%. Ese dinero podría ayudar a emergencias, reducir deuda o financiar inversiones futuras.`
        : "Has utilizado todo el presupuesto disponible. No queda margen para imprevistos o nuevas prioridades.";

    this.addText(x + 20, y + 14, `Total asignado: ${this.totalAssigned()}%   |   Superávit: ${surplus}%`, 18, "#17211f", 520, "bold");
    this.addText(x + 20, y + 44, surplusMessage, 15, "#364340", 500);
    this.addText(
      x + 560,
      y + 14,
      `Gastaste más que el presupuesto real en: ${over.length ? over.join(", ") : "ningún sector"}.`,
      14,
      "#364340",
      490
    );
    this.addText(
      x + 560,
      y + 62,
      `Asignaste menos que el presupuesto real en: ${under.length ? under.join(", ") : "ningún sector"}.`,
      14,
      "#364340",
      490
    );
  }

  private drawIndicators(x: number, y: number) {
    const total = this.totalAssigned();
    const surplus = this.surplus();
    this.drawInfoPanel(x, y, 300, 86, "Total asignado", [`${total}% de 100%`]);
    this.drawInfoPanel(x + 326, y, 336, 86, "Superávit disponible", [`${surplus}% de dinero no asignado`]);
    this.add
      .rectangle(x + 690, y, 380, 86, 0xffffff, 0.94)
      .setOrigin(0)
      .setStrokeStyle(1, 0xd7ded8);
    this.addText(x + 712, y + 14, "Bóveda de recursos", 17, "#17211f", 220, "bold");
    this.drawBar(x + 712, y + 50, 250, 18, surplus / 100, 0xf5cc61);
    this.addText(x + 978, y + 43, `${surplus}%`, 22, "#17211f", 80, "bold");
  }

  private drawHeader(title: string, subtitle: string) {
    this.addText(48, 34, title, 38, "#17211f", 700, "bold");
    this.addText(50, 84, subtitle, 19, "#51605c", 780);
  }

  private drawBackground() {
    this.add.rectangle(0, 0, WIDTH, HEIGHT, 0xf7f5ef).setOrigin(0);
    this.add.rectangle(0, 0, WIDTH, HEIGHT, 0xd8f1df, 0.28).setOrigin(0);
    this.add.rectangle(34, 24, WIDTH - 68, HEIGHT - 48, 0xffffff, 0.58).setOrigin(0);
  }

  private drawInfoPanel(x: number, y: number, width: number, height: number, title: string, lines: string[]) {
    this.add
      .rectangle(x, y, width, height, 0xffffff, 0.94)
      .setOrigin(0)
      .setStrokeStyle(1, 0xd7ded8);
    this.addText(x + 18, y + 14, title, 20, "#17211f", width - 36, "bold");
    lines.forEach((line, index) => {
      this.addText(x + 18, y + 50 + index * 42, line, 17, "#364340", width - 36);
    });
  }

  private drawMiniBudgetGraphic(x: number, y: number) {
    this.add.rectangle(x, y, 250, 144, 0xffffff, 0.95).setOrigin(0).setStrokeStyle(1, 0xd7ded8);
    this.add.circle(x + 64, y + 76, 40, 0xf5cc61);
    this.add.rectangle(x + 118, y + 38, 88, 78, 0xd8f1df).setOrigin(0).setStrokeStyle(2, 0x1d8a85);
    this.addText(x + 41, y + 59, "100%", 23, "#17211f", 80, "bold");
    this.addText(x + 132, y + 58, "Decide", 18, "#17211f", 80, "bold");
    this.addText(x + 34, y + 124, "Recursos limitados", 15, "#51605c", 180);
  }

  private drawSmallBar(x: number, y: number, width: number, percent: number, color: number) {
    this.drawBar(x, y, width, 14, percent / 100, color);
  }

  private drawBar(x: number, y: number, width: number, height: number, progress: number, color: number) {
    this.add.rectangle(x, y, width, height, 0xe9eee9).setOrigin(0);
    this.add.rectangle(x, y, width * Phaser.Math.Clamp(progress, 0, 1), height, color).setOrigin(0);
  }

  private showInfoCard(sector: Sector, x: number, y: number, pinned = false) {
    this.hideInfoCard();
    const cardX = Phaser.Math.Clamp(x, 46, WIDTH - 390);
    const cardY = Phaser.Math.Clamp(y, 120, HEIGHT - 228);
    const card = this.add.container(cardX, cardY).setDepth(20);
    card.add(this.add.rectangle(0, 0, 360, 190, 0xffffff, 0.98).setOrigin(0).setStrokeStyle(2, sector.color));
    card.add(this.addText(16, 14, sector.name, 20, "#17211f", 300, "bold"));
    card.add(this.addText(16, 48, sector.official, 15, "#364340", 326));
    card.add(this.addText(16, 112, sector.citizen, 14, "#51605c", 326));
    if (pinned) {
      const close = this.addButton(318, 10, 28, 28, "×", () => this.hideInfoCard(), "plain");
      card.add(close);
    }
    this.infoCard = card;
  }

  private hideInfoCard() {
    this.infoCard?.destroy(true);
    this.infoCard = undefined;
  }

  private addButton(
    x: number,
    y: number,
    width: number,
    height: number,
    label: string,
    onClick: () => void,
    variant: "primary" | "secondary" | "plain"
  ) {
    const colors = {
      primary: { fill: 0xf5cc61, stroke: 0x17211f, text: "#17211f" },
      secondary: { fill: 0xffffff, stroke: 0x17211f, text: "#17211f" },
      plain: { fill: 0xf8faf6, stroke: 0xd7ded8, text: "#17211f" }
    }[variant];

    const container = this.add.container(x, y);
    const rect = this.add
      .rectangle(0, 0, width, height, colors.fill)
      .setOrigin(0)
      .setStrokeStyle(1, colors.stroke)
      .setInteractive({ useHandCursor: true });
    const text = this.add
      .text(width / 2, height / 2, label, {
        color: colors.text,
        fontFamily: "Inter, system-ui, sans-serif",
        fontSize: height <= 34 ? "20px" : "19px",
        fontStyle: "bold",
        align: "center",
        wordWrap: { width: width - 18 }
      })
      .setOrigin(0.5);

    container.add([rect, text]);
    container.setSize(width, height);
    rect.on("pointerover", () => rect.setFillStyle(variant === "primary" ? 0xffd96f : 0xf0f5ef));
    rect.on("pointerout", () => rect.setFillStyle(colors.fill));
    rect.on("pointerdown", onClick);
    return container;
  }

  private addText(
    x: number,
    y: number,
    text: string,
    size: number,
    color: string,
    width: number,
    weight: "normal" | "bold" = "normal"
  ) {
    return this.add.text(x, y, text, {
      color,
      fontFamily: "Inter, system-ui, sans-serif",
      fontSize: `${size}px`,
      fontStyle: weight,
      lineSpacing: 4,
      wordWrap: { width }
    });
  }

  private clearScreen() {
    this.hideInfoCard();
    this.children.removeAll(true);
  }
}

new Phaser.Game({
  type: Phaser.AUTO,
  parent: "game",
  width: WIDTH,
  height: HEIGHT,
  backgroundColor: "#f7f5ef",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: BudgetSimulatorScene
});

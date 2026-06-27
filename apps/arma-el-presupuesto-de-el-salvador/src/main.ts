import Phaser from "phaser";
import "./styles.css";
import guideAvatarUrl from "./assets/art/character_guide_neutral_2x.png";
import educationIconUrl from "./assets/art/icon_sector_education_2x.png";
import coinCashStackUrl from "./assets/art/prop_coin_cash_stack_2x.png";

const WIDTH = 1180;
const HEIGHT = 820;
const GUIDE_URL =
  "https://www.transparenciafiscal.gob.sv/downloads/pdf/700-DGP-GA-2025-GPC25.pdf";

const COLORS = {
  blue: 0x0d47a1,
  blueHover: 0x1565c0,
  teal: 0x0097a7,
  tealDark: 0x007c89,
  green: 0x43a047,
  sky: 0x4fc3f7,
  yellow: 0xffc107,
  coral: 0xff7043,
  purple: 0x7e57c2,
  gray: 0x607d8b,
  lightGray: 0xeceff1,
  background: 0xf7fafc,
  panel: 0xffffff,
  line: 0xd4e4f6,
  ink: 0x092154,
  muted: 0x4f6072
};

const TEXT = {
  blue: "#0D47A1",
  teal: "#0097A7",
  green: "#43A047",
  yellow: "#FFC107",
  coral: "#FF7043",
  purple: "#7E57C2",
  gray: "#607D8B",
  ink: "#092154",
  muted: "#4F6072",
  soft: "#6F8094"
};

const IMAGE_KEYS = {
  guideAvatar: "character-guide-neutral",
  educationIcon: "icon-sector-education",
  coinCashStack: "prop-coin-cash-stack"
};

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

type AssignmentRowView = {
  fill: Phaser.GameObjects.Rectangle;
  percentText: Phaser.GameObjects.Text;
  thumb: Phaser.GameObjects.Arc;
  sliderX: number;
  sliderWidth: number;
};

type IndicatorView = {
  totalText: Phaser.GameObjects.Text;
  surplusText: Phaser.GameObjects.Text;
  vaultFill: Phaser.GameObjects.Rectangle;
  vaultText: Phaser.GameObjects.Text;
};

const sectors: Sector[] = [
  {
    id: "educacion",
    name: "Educación",
    icon: "📘",
    official: "Ministerio de Educación, Ciencia y Tecnología",
    citizen:
      "Recursos para escuelas, formación docente, materiales educativos y oportunidades de aprendizaje.",
    feedback:
      "Aumentar este sector puede mejorar escuelas, formación docente y materiales educativos, pero deja menos recursos para otras áreas.",
    realPercent: 15.9,
    color: COLORS.blue
  },
  {
    id: "salud",
    name: "Salud",
    icon: "♥",
    official: "Ministerio de Salud",
    citizen:
      "Recursos para hospitales, medicamentos, prevención y atención médica a la población.",
    feedback:
      "Aumentar este sector puede fortalecer hospitales, medicamentos y atención médica, pero reduce recursos disponibles para otras prioridades.",
    realPercent: 12.2,
    color: COLORS.coral
  },
  {
    id: "seguridad",
    name: "Seguridad Pública",
    icon: "⬟",
    official: "Ministerio de Justicia y Seguridad Pública",
    citizen:
      "Recursos para prevención del delito, seguridad ciudadana y funcionamiento de instituciones de justicia y seguridad.",
    feedback:
      "Aumentar este sector puede fortalecer la prevención del delito y la seguridad ciudadana, pero deja menos presupuesto para otros servicios públicos.",
    realPercent: 6.1,
    color: COLORS.gray
  },
  {
    id: "defensa",
    name: "Defensa Nacional",
    icon: "♟",
    official: "Ministerio de la Defensa Nacional",
    citizen:
      "Recursos para proteger la soberanía, apoyar emergencias y mantener capacidades de defensa del país.",
    feedback:
      "Aumentar este sector puede fortalecer la capacidad de defensa del país, pero limita recursos para otras áreas del presupuesto.",
    realPercent: 3.3,
    color: COLORS.green
  },
  {
    id: "infraestructura",
    name: "Infraestructura y transporte",
    icon: "⚒",
    official: "Ministerio de Obras Públicas y de Transporte",
    citizen:
      "Recursos para carreteras, transporte, obras públicas y mantenimiento de infraestructura.",
    feedback:
      "Aumentar este sector puede mejorar carreteras, transporte y obras públicas, pero reduce recursos para otros programas.",
    realPercent: 7.5,
    color: COLORS.yellow
  },
  {
    id: "programas",
    name: "Programas sociales y desarrollo",
    icon: "●●",
    official:
      "Ministerios de Trabajo, Cultura, Vivienda, Desarrollo Local, Economía, Agricultura, Medio Ambiente, Turismo y Gobernación.",
    citizen:
      "Recursos para vivienda, empleo, agricultura, cultura, turismo, ambiente y desarrollo territorial.",
    feedback:
      "Aumentar este sector puede apoyar vivienda, agricultura, cultura y desarrollo local, pero deja menos recursos para otras prioridades.",
    realPercent: 6.2,
    color: COLORS.purple
  },
  {
    id: "administracion",
    name: "Administración del Estado",
    icon: "⚙",
    official:
      "Presidencia de la República, Ministerio de Hacienda, Relaciones Exteriores, Ministerio Público y otras instituciones.",
    citizen:
      "Recursos para que las instituciones públicas funcionen, planifiquen, atiendan y administren servicios.",
    feedback:
      "Aumentar este sector puede fortalecer el funcionamiento de las instituciones públicas, pero reduce recursos para otras áreas.",
    realPercent: 5.0,
    color: COLORS.teal
  },
  {
    id: "transferencias",
    name: "Transferencias y obligaciones",
    icon: "↔",
    official: "Obligaciones Generales del Estado; Transferencias Varias",
    citizen:
      "Recursos que el Estado entrega a otras instituciones o compromisos que debe cumplir por ley.",
    feedback:
      "Aumentar este sector permite cumplir compromisos del Estado con otras instituciones, pero reduce recursos disponibles para gasto directo.",
    realPercent: 9.4,
    color: 0x1976d2
  },
  {
    id: "deuda",
    name: "Pago de deuda",
    icon: "$",
    official: "Pago de deuda pública: intereses y principal",
    citizen:
      "Dinero destinado a pagar préstamos anteriores. Si no se paga ahora, se deberá pagar en próximos años y con intereses.",
    feedback:
      "Aumentar este sector permite cumplir pagos de deuda del país, pero deja menos recursos para programas y servicios públicos.",
    realPercent: 28.8,
    color: 0xb47b11
  },
  {
    id: "organos",
    name: "Órganos Legislativo y Judicial",
    icon: "⚖",
    official: "Órgano Legislativo y Órgano Judicial",
    citizen:
      "Instituciones encargadas de elaborar leyes, resolver conflictos y administrar justicia.",
    feedback:
      "Aumentar este sector puede fortalecer la elaboración de leyes y la administración de justicia, pero reduce recursos para otras áreas.",
    realPercent: 5.6,
    color: COLORS.purple
  }
];

class BudgetSimulatorScene extends Phaser.Scene {
  private screen: ScreenName = "intro";
  private allocations: Record<string, number> = {};
  private assignmentRows = new Map<string, AssignmentRowView>();
  private infoCard?: Phaser.GameObjects.Container;
  private feedbackText?: Phaser.GameObjects.Text;
  private indicatorView?: IndicatorView;

  constructor() {
    super("BudgetSimulatorScene");
  }

  preload() {
    this.load.image(IMAGE_KEYS.guideAvatar, guideAvatarUrl);
    this.load.image(IMAGE_KEYS.educationIcon, educationIconUrl);
    this.load.image(IMAGE_KEYS.coinCashStack, coinCashStackUrl);
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

    this.addText(64, 68, "Arma el presupuesto", 42, TEXT.blue, 470, "bold");
    this.addText(64, 118, "de El Salvador", 42, TEXT.teal, 470, "bold");
    const intro = this.addText(
      68,
      190,
      "Distribuye los recursos del país, aprende cómo se usan y construye un mejor futuro para todas y todos.",
      22,
      TEXT.muted,
      420
    );
    const reminder = this.addText(
      68,
      intro.y + intro.height + 34,
      "Tu misión es repartir el 100% sin generar déficit. Si decides gastar más en un área, habrá menos recursos para otras.",
      19,
      TEXT.muted,
      430
    );
    this.addText(
      68,
      reminder.y + reminder.height + 28,
      "Al final podrás comparar tu presupuesto con la forma en que realmente se distribuye el presupuesto del Estado.",
      19,
      TEXT.muted,
      430
    );

    this.drawIntroHeroArt(560, 116);
    this.drawInfoPanel(782, 118, 292, 212, "Presupuesto 2025", [
      "Presupuesto del Estado de El Salvador",
      "Total: 9,663 millones de dólares",
      "Tu misión: repartir 100% sin generar déficit."
    ]);

    this.addButton(68, 628, 260, 62, "Comenzar  ›", () => this.renderAssignment(), "primary");
    this.addText(70, 706, "★ Aprende jugando, decide con responsabilidad.", 13, TEXT.muted, 360);
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
    this.drawAssignmentRows(48, 242);

    const feedback =
      message ??
      "Arrastra o toca las barras para asignar presupuesto. Cada decisión cambia el superávit disponible.";
    this.addPanel(48, 692, 760, 86, COLORS.panel, COLORS.line, 0.96, 8);
    this.add.image(86, 735, IMAGE_KEYS.guideAvatar).setDisplaySize(62, 62);
    this.addText(128, 706, "Traductor ciudadano", 13, TEXT.teal, 240, "bold");
    this.feedbackText = this.addText(128, 728, feedback, 16, TEXT.muted, 650);
    this.addButton(850, 704, 270, 60, "Ver mi presupuesto", () => this.renderBridge(), "primary");
  }

  private drawAssignmentRows(x: number, y: number) {
    const rowHeight = 42;
    this.addPanel(x, y - 8, 1070, rowHeight * sectors.length + 18, COLORS.panel, COLORS.line, 0.98, 8);
    this.addSectionPill(x, y - 40, "Sectores");
    sectors.forEach((sector, index) => {
      const rowY = y + index * rowHeight;
      const sliderX = x + 402;
      const sliderWidth = 512;
      const sliderY = rowY + 18;
      const fill = index % 2 === 0 ? COLORS.panel : COLORS.background;
      this.add.rectangle(x + 12, rowY, 1046, 36, fill, 0.86).setOrigin(0).setStrokeStyle(1, COLORS.line);

      this.drawSectorIcon(x + 34, rowY + 18, sector, 14);

      const name = this.addText(x + 64, rowY + 8, sector.name, 15, TEXT.blue, 310, "bold");
      name.setInteractive({ useHandCursor: true });
      name.on("pointerover", () => this.showInfoCard(sector, x + 368, rowY - 16));
      name.on("pointerout", () => this.hideInfoCard());
      name.on("pointerdown", () => this.showInfoCard(sector, x + 368, rowY - 16, true));

      this.drawSlider(sector, sliderX, sliderY, sliderWidth);
      const percentText = this.addText(x + 948, rowY + 7, "0%", 20, TEXT.ink, 70, "bold");
      this.assignmentRows.set(sector.id, {
        fill: this.children.getByName(`fill-${sector.id}`) as Phaser.GameObjects.Rectangle,
        percentText,
        thumb: this.children.getByName(`thumb-${sector.id}`) as Phaser.GameObjects.Arc,
        sliderX,
        sliderWidth
      });
    });

    this.updateAssignmentViews();
  }

  private renderBridge() {
    this.screen = "bridge";
    this.clearScreen();
    this.drawBackground();
    this.drawHeader(
      "Cada presupuesto refleja prioridades",
      "Al aumentar recursos en algunas áreas, necesariamente quedan menos recursos disponibles para otras."
    );

    this.drawIndicators(56, 168);
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

    this.drawComparisonChart(48, 168);
    this.drawComparisonTable(724, 126);
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
    const barX = x + 260;
    const barWidth = 260;
    const rowHeight = 43;
    this.addPanel(x - 12, y - 42, 660, 476, COLORS.panel, COLORS.line, 0.96, 8);
    this.addSectionPill(x, y - 42, "Gráfico comparativo");
    this.addText(barX, y - 26, "Tu presupuesto", 14, TEXT.teal, 140, "bold");
    this.addText(barX + 160, y - 26, "Real 2025", 14, TEXT.blue, 110, "bold");

    sectors.forEach((sector, index) => {
      const rowY = y + index * rowHeight;
      const player = this.allocations[sector.id];
      this.drawSectorIcon(x + 14, rowY + 12, sector, 11);
      this.addText(x + 34, rowY + 6, sector.name, 14, TEXT.ink, 184, "bold");
      this.drawBar(barX, rowY + 6, barWidth, 11, player / maxBar, COLORS.teal);
      this.drawBar(barX, rowY + 22, barWidth, 11, sector.realPercent / maxBar, COLORS.blue);
      this.addText(barX + barWidth + 8, rowY - 1, `${player}%`, 13, TEXT.teal, 42, "bold");
      this.addText(barX + barWidth + 8, rowY + 15, `${sector.realPercent.toFixed(1)}%`, 13, TEXT.blue, 58);
    });
  }

  private drawComparisonTable(x: number, y: number) {
    this.addPanel(x, y, 408, 462, COLORS.panel, COLORS.line, 0.96, 8);
    this.addText(x + 18, y + 16, "Tabla comparativa", 21, TEXT.blue, 240, "bold");
    this.addText(x + 18, y + 54, "Área", 13, TEXT.soft, 150, "bold");
    this.addText(x + 230, y + 54, "Tú", 13, TEXT.soft, 46, "bold");
    this.addText(x + 310, y + 54, "Real", 13, TEXT.soft, 58, "bold");

    sectors.forEach((sector, index) => {
      const rowY = y + 80 + index * 31;
      const name = this.addText(x + 18, rowY, sector.name, 12, TEXT.blue, 190, "bold");
      name.setInteractive({ useHandCursor: true });
      name.on("pointerover", () => this.showInfoCard(sector, x - 260, rowY - 18));
      name.on("pointerout", () => this.hideInfoCard());
      name.on("pointerdown", () => this.showInfoCard(sector, x - 260, rowY - 18, true));
      this.addText(x + 232, rowY, `${this.allocations[sector.id]}%`, 13, TEXT.ink, 54, "bold");
      this.addText(x + 310, rowY, `${sector.realPercent.toFixed(1)}%`, 13, TEXT.muted, 58);
    });

    const surplusY = y + 80 + sectors.length * 31 + 8;
    this.add.rectangle(x + 14, surplusY - 8, 380, 1, COLORS.line).setOrigin(0);
    this.addText(x + 18, surplusY + 4, "Superávit", 13, TEXT.ink, 180, "bold");
    this.addText(x + 232, surplusY + 4, `${this.surplus()}%`, 13, TEXT.green, 56, "bold");
    this.addText(x + 310, surplusY + 4, "-", 13, TEXT.muted, 32);
    this.addText(
      x + 18,
      y + 430,
      "Fuente: Ministerio de Hacienda, Guía del Presupuesto General del Estado para el Ciudadano 2025.",
      11,
      TEXT.soft,
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

    this.addPanel(x, y, 1084, 112, COLORS.panel, COLORS.line, 0.96, 8);

    const surplusMessage =
      surplus > 0
        ? `Has dejado un superávit de ${surplus}%. Ese dinero podría ayudar a emergencias, reducir deuda o financiar inversiones futuras.`
        : "Has utilizado todo el presupuesto disponible. No queda margen para imprevistos o nuevas prioridades.";

    this.addText(x + 20, y + 14, `Total asignado: ${this.totalAssigned()}%   |   Superávit: ${surplus}%`, 18, TEXT.blue, 520, "bold");
    this.addText(x + 20, y + 44, surplusMessage, 15, TEXT.muted, 500);
    const overSummary = over.length ? `${over.length} sectores. Revisa la tabla para ver cuáles.` : "ningún sector.";
    const underSummary = under.length ? `${under.length} sectores. Revisa la tabla para ver cuáles.` : "ningún sector.";
    this.addText(x + 560, y + 18, `Más que el presupuesto real: ${overSummary}`, 14, TEXT.muted, 490);
    this.addText(x + 560, y + 62, `Menos que el presupuesto real: ${underSummary}`, 14, TEXT.muted, 490);
  }

  private drawIndicators(x: number, y: number) {
    const total = this.totalAssigned();
    const surplus = this.surplus();
    this.addPanel(x, y, 300, 86, COLORS.panel, COLORS.line, 0.96, 8);
    this.addText(x + 18, y + 14, "Presupuesto total", 16, TEXT.soft, 264, "bold");
    const totalText = this.addText(x + 18, y + 42, "100%", 22, TEXT.blue, 264, "bold");

    this.addPanel(x + 326, y, 336, 86, COLORS.panel, COLORS.line, 0.96, 8);
    this.addText(x + 344, y + 14, "Asignado", 16, TEXT.soft, 300, "bold");
    const surplusText = this.addText(x + 344, y + 42, `${total}% asignado`, 22, TEXT.teal, 300, "bold");

    this.addPanel(x + 690, y, 380, 86, COLORS.panel, COLORS.line, 0.96, 8);
    this.addText(x + 712, y + 14, "Bóveda de recursos", 16, TEXT.soft, 220, "bold");
    this.add.rectangle(x + 712, y + 52, 250, 16, COLORS.lightGray).setOrigin(0);
    const vaultFill = this.add.rectangle(x + 712, y + 52, 250, 16, COLORS.green).setOrigin(0);
    const vaultText = this.addText(x + 978, y + 41, `${surplus}%`, 24, TEXT.green, 80, "bold");
    this.indicatorView = { totalText, surplusText, vaultFill, vaultText };
  }

  private drawHeader(title: string, subtitle: string) {
    this.addText(48, 34, title, 36, TEXT.blue, 780, "bold");
    this.add.rectangle(50, 80, 86, 5, COLORS.teal).setOrigin(0);
    this.addText(50, 92, subtitle, 17, TEXT.muted, 1040);
  }

  private drawBackground() {
    this.add.rectangle(0, 0, WIDTH, HEIGHT, COLORS.background).setOrigin(0);
    this.add.circle(170, 48, 170, COLORS.sky, 0.1);
    this.add.circle(1010, 30, 126, COLORS.sky, 0.11);
    this.drawCloud(922, 70, 0.7);
    this.drawCloud(1018, 48, 0.56);
    this.drawDistantSkyline(790, 70);
    this.addPanel(34, 24, WIDTH - 68, HEIGHT - 48, COLORS.panel, COLORS.line, 0.78, 8, false);
  }

  private drawInfoPanel(x: number, y: number, width: number, height: number, title: string, lines: string[]) {
    this.addPanel(x, y, width, height, COLORS.panel, COLORS.line, 0.96, 8);
    this.addText(x + 18, y + 14, title, 19, TEXT.blue, width - 36, "bold");
    lines.forEach((line, index) => {
      this.addText(x + 18, y + 50 + index * 42, line, 15, TEXT.muted, width - 36);
    });
  }

  private addSectionPill(x: number, y: number, label: string) {
    const width = Math.max(154, label.length * 9 + 36);
    const pill = this.add.graphics();
    pill.fillStyle(COLORS.blue, 1);
    pill.fillRoundedRect(x, y, width, 28, 8);
    this.addText(x + 18, y + 6, label, 14, "#FFFFFF", width - 36, "bold");
  }

  private drawSectorIcon(x: number, y: number, sector: Sector, radius: number) {
    this.add.circle(x, y, radius, COLORS.panel).setStrokeStyle(2, sector.color);
    if (sector.id === "educacion") {
      this.add.image(x, y, IMAGE_KEYS.educationIcon).setDisplaySize(radius * 2.15, radius * 2.15);
      return;
    }
    const size = radius <= 11 ? 11 : 15;
    this.addText(x - radius + 3, y - size / 1.45, sector.icon, size, this.colorHex(sector.color), radius * 2, "bold");
  }

  private addPanel(
    x: number,
    y: number,
    width: number,
    height: number,
    fill = COLORS.panel,
    stroke = COLORS.line,
    alpha = 1,
    radius = 8,
    shadow = true
  ) {
    const panel = this.add.graphics();
    if (shadow) {
      panel.fillStyle(COLORS.blue, 0.08);
      panel.fillRoundedRect(x + 4, y + 7, width, height, radius);
    }
    panel.fillStyle(fill, alpha);
    panel.fillRoundedRect(x, y, width, height, radius);
    panel.lineStyle(1, stroke, 1);
    panel.strokeRoundedRect(x, y, width, height, radius);
    return panel;
  }

  private drawIntroHeroArt(x: number, y: number) {
    this.addPanel(x, y, 482, 456, COLORS.panel, COLORS.line, 0.98, 8);
    const g = this.add.graphics();

    g.fillStyle(0xdff5ff, 1);
    g.fillRoundedRect(x + 18, y + 18, 446, 282, 8);
    g.fillStyle(0xb9ddff, 1);
    g.fillTriangle(x + 40, y + 196, x + 178, y + 58, x + 312, y + 196);
    g.fillStyle(0xd2eafe, 1);
    g.fillTriangle(x + 174, y + 198, x + 328, y + 74, x + 462, y + 198);
    g.fillStyle(0x7bbd57, 1);
    g.fillRoundedRect(x + 18, y + 220, 446, 80, 0);
    g.fillStyle(0x5aa340, 1);
    g.fillRoundedRect(x + 18, y + 262, 446, 38, 0);

    this.drawCloud(x + 72, y + 76, 0.55);
    this.drawCloud(x + 360, y + 62, 0.45);
    this.drawGovernmentBuilding(x + 190, y + 116);
    this.drawFlag(x + 282, y + 91);
    this.drawTree(x + 78, y + 214, 0.82);
    this.drawTree(x + 404, y + 212, 0.72);
    this.add.image(x + 388, y + 344, IMAGE_KEYS.coinCashStack).setDisplaySize(128, 96);
    this.drawStudent(x + 105, y + 324, COLORS.yellow, 0x4a2d1a);
    this.drawStudent(x + 210, y + 316, COLORS.teal, 0x162436);
    this.drawStudent(x + 314, y + 324, COLORS.coral, 0x2d1b14);

    this.addText(x + 30, y + 408, "★ Aprende · Decide · Construye el país", 14, TEXT.blue, 360, "bold");
  }

  private drawCloud(x: number, y: number, scale: number) {
    this.add.circle(x, y + 8 * scale, 18 * scale, 0xffffff, 0.9);
    this.add.circle(x + 20 * scale, y, 24 * scale, 0xffffff, 0.9);
    this.add.circle(x + 46 * scale, y + 10 * scale, 18 * scale, 0xffffff, 0.9);
    this.add.rectangle(x - 6 * scale, y + 10 * scale, 60 * scale, 18 * scale, 0xffffff, 0.9).setOrigin(0);
  }

  private drawDistantSkyline(x: number, y: number) {
    const g = this.add.graphics();
    g.fillStyle(0xb7d4f6, 0.34);
    g.fillTriangle(x, y + 72, x + 110, y + 8, x + 230, y + 72);
    g.fillTriangle(x + 130, y + 72, x + 270, y + 18, x + 414, y + 72);
    g.fillStyle(0x9ec4ef, 0.4);
    [0, 30, 62, 98, 314, 346].forEach((offset, index) => {
      g.fillRect(x + 180 + offset, y + 44 - (index % 3) * 8, 18, 28 + (index % 3) * 8);
    });
  }

  private drawGovernmentBuilding(x: number, y: number) {
    const g = this.add.graphics();
    g.fillStyle(0xffffff, 1);
    g.fillRoundedRect(x, y + 54, 126, 76, 4);
    g.fillStyle(0xe8f2ff, 1);
    g.fillTriangle(x + 4, y + 54, x + 63, y + 18, x + 122, y + 54);
    g.fillStyle(COLORS.blue, 1);
    g.fillRoundedRect(x + 44, y, 38, 26, 13);
    g.fillStyle(0xffffff, 1);
    g.fillRoundedRect(x + 51, y + 5, 24, 18, 9);
    g.fillStyle(0xe0eaf8, 1);
    [20, 46, 72, 98].forEach((offset) => {
      g.fillRoundedRect(x + offset, y + 64, 12, 52, 3);
    });
    g.fillStyle(0xd7e7fb, 1);
    g.fillRect(x - 10, y + 124, 146, 12);
    g.fillStyle(COLORS.yellow, 1);
    g.fillRect(x + 14, y + 118, 98, 6);
  }

  private drawFlag(x: number, y: number) {
    this.add.rectangle(x, y, 3, 54, COLORS.blue).setOrigin(0);
    this.add.rectangle(x + 4, y + 4, 42, 10, COLORS.blue).setOrigin(0);
    this.add.rectangle(x + 4, y + 14, 42, 9, COLORS.panel).setOrigin(0);
    this.add.rectangle(x + 4, y + 23, 42, 10, COLORS.blue).setOrigin(0);
  }

  private drawTree(x: number, y: number, scale: number) {
    this.add.rectangle(x - 5 * scale, y + 28 * scale, 10 * scale, 36 * scale, 0x8b5a2b).setOrigin(0.5, 0);
    this.add.circle(x, y + 12 * scale, 24 * scale, 0x5da83f);
    this.add.circle(x - 18 * scale, y + 28 * scale, 19 * scale, 0x43a047);
    this.add.circle(x + 18 * scale, y + 28 * scale, 19 * scale, 0x43a047);
  }

  private drawCoins(x: number, y: number) {
    [0, 12, 24, 36].forEach((offset) => {
      this.add.ellipse(x, y - offset, 54, 18, COLORS.yellow).setStrokeStyle(2, 0xd89a00);
      this.add.rectangle(x - 27, y - offset - 8, 54, 14, COLORS.yellow).setOrigin(0).setStrokeStyle(1, 0xd89a00);
    });
    this.add.rectangle(x + 52, y - 4, 52, 34, 0x74d676).setOrigin(0).setStrokeStyle(2, 0x43a047);
    this.addText(x + 61, y + 5, "$", 18, TEXT.green, 28, "bold");
  }

  private drawStudent(x: number, y: number, shirt: number, hair: number) {
    this.add.circle(x, y, 24, 0xf3b27b);
    this.add.circle(x, y - 12, 25, hair, 0.95);
    this.add.circle(x - 8, y - 2, 3, COLORS.ink);
    this.add.circle(x + 8, y - 2, 3, COLORS.ink);
    this.add.arc(x, y + 8, 12, 0, 180, false, 0x7a3d24, 1);
    this.add.rectangle(x - 22, y + 28, 44, 58, shirt).setOrigin(0).setStrokeStyle(2, 0xffffff);
    this.add.circle(x - 27, y + 48, 8, shirt);
    this.add.circle(x + 27, y + 48, 8, shirt);
  }

  private drawSlider(sector: Sector, x: number, y: number, width: number) {
    const track = this.add.rectangle(x, y - 5, width, 10, COLORS.lightGray).setOrigin(0);
    this.add.circle(x, y, 5, COLORS.lightGray);
    this.add.circle(x + width, y, 5, COLORS.lightGray);

    const fill = this.add
      .rectangle(x, y - 5, 1, 10, sector.color)
      .setOrigin(0)
      .setName(`fill-${sector.id}`)
      .setVisible(false);
    const thumb = this.add
      .circle(x, y, 14, COLORS.panel)
      .setStrokeStyle(4, sector.color)
      .setName(`thumb-${sector.id}`);
    const hitArea = this.add
      .rectangle(x, y - 19, width, 38, 0xffffff, 0.001)
      .setOrigin(0)
      .setInteractive({ useHandCursor: true });

    this.input.setDraggable(hitArea);
    track.setInteractive({ useHandCursor: true });
    track.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      this.setSectorFromPointer(sector, pointer, x, width);
    });
    hitArea.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      this.setSectorFromPointer(sector, pointer, x, width);
    });
    hitArea.on("drag", (pointer: Phaser.Input.Pointer) => {
      this.setSectorFromPointer(sector, pointer, x, width);
    });
    thumb.setInteractive({ useHandCursor: true });
    this.input.setDraggable(thumb);
    thumb.on("drag", (pointer: Phaser.Input.Pointer) => {
      this.setSectorFromPointer(sector, pointer, x, width);
    });
    thumb.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      this.setSectorFromPointer(sector, pointer, x, width);
    });
  }

  private drawBar(x: number, y: number, width: number, height: number, progress: number, color: number) {
    const bar = this.add.graphics();
    const radius = Math.max(3, height / 2);
    const fillWidth = Math.max(width * Phaser.Math.Clamp(progress, 0, 1), progress > 0 ? radius : 0);
    bar.fillStyle(COLORS.lightGray, 1);
    bar.fillRoundedRect(x, y, width, height, radius);
    if (fillWidth > 0) {
      bar.fillStyle(color, 1);
      bar.fillRoundedRect(x, y, fillWidth, height, radius);
    }
  }

  private showInfoCard(sector: Sector, x: number, y: number, pinned = false) {
    this.hideInfoCard();
    const cardX = Phaser.Math.Clamp(x, 46, WIDTH - 390);
    const cardY = Phaser.Math.Clamp(y, 120, HEIGHT - 228);
    const card = this.add.container(cardX, cardY).setDepth(20);
    const bg = this.add.graphics();
    bg.fillStyle(COLORS.panel, 0.99);
    bg.fillRoundedRect(0, 0, 360, 190, 8);
    bg.lineStyle(2, sector.color, 1);
    bg.strokeRoundedRect(0, 0, 360, 190, 8);
    card.add(bg);
    card.add(this.addText(16, 14, sector.name, 20, TEXT.blue, 300, "bold"));
    card.add(this.addText(16, 48, sector.official, 15, TEXT.muted, 326));
    card.add(this.addText(16, 112, sector.citizen, 14, TEXT.soft, 326));
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
      primary: { fill: COLORS.blue, hover: COLORS.blueHover, stroke: COLORS.blue, text: "#FFFFFF" },
      secondary: { fill: COLORS.panel, hover: 0xeaf4ff, stroke: COLORS.blue, text: TEXT.blue },
      plain: { fill: COLORS.background, hover: 0xeaf4ff, stroke: COLORS.line, text: TEXT.blue }
    }[variant];

    const container = this.add.container(x, y);
    const shape = this.add.graphics();
    const drawShape = (fill: number) => {
      shape.clear();
      shape.fillStyle(COLORS.blue, variant === "primary" ? 0.16 : 0.06);
      shape.fillRoundedRect(3, 5, width, height, 8);
      shape.fillStyle(fill, 1);
      shape.fillRoundedRect(0, 0, width, height, 8);
      shape.lineStyle(2, colors.stroke, 1);
      shape.strokeRoundedRect(0, 0, width, height, 8);
    };
    drawShape(colors.fill);
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

    const hitArea = this.add
      .rectangle(0, 0, width, height, 0xffffff, 0.001)
      .setOrigin(0)
      .setInteractive({ useHandCursor: true });

    container.add([shape, text, hitArea]);
    container.setSize(width, height);
    hitArea.on("pointerover", () => drawShape(colors.hover));
    hitArea.on("pointerout", () => drawShape(colors.fill));
    hitArea.on("pointerdown", onClick);
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

  private colorHex(color: number) {
    return `#${color.toString(16).padStart(6, "0").toUpperCase()}`;
  }

  private clearScreen() {
    this.hideInfoCard();
    this.assignmentRows.clear();
    this.indicatorView = undefined;
    this.children.removeAll(true);
  }

  private setSectorFromPointer(
    sector: Sector,
    pointer: Phaser.Input.Pointer,
    sliderX: number,
    sliderWidth: number
  ) {
    const requested = Math.round(
      Phaser.Math.Clamp(((pointer.x - sliderX) / sliderWidth) * 100, 0, 100)
    );
    const current = this.allocations[sector.id];
    const maxAllowed = current + this.surplus();
    const next = Phaser.Math.Clamp(requested, 0, maxAllowed);

    if (next === current && requested > maxAllowed) {
      this.feedbackText?.setText(
        "No puedes asignar más presupuesto porque ya no queda superávit disponible."
      );
      return;
    }

    if (next === current) {
      return;
    }

    this.allocations[sector.id] = next;
    this.updateAssignmentViews(sector.feedback);
  }

  private updateAssignmentViews(feedback?: string) {
    const total = this.totalAssigned();
    const surplus = this.surplus();

    this.indicatorView?.totalText.setText("100%");
    this.indicatorView?.surplusText.setText(`${total}% asignado`);
    this.indicatorView?.vaultText.setText(`${surplus}%`);
    if (this.indicatorView) {
      const fillWidth = 250 * (surplus / 100);
      this.indicatorView.vaultFill.setVisible(fillWidth > 0);
      this.indicatorView.vaultFill.displayWidth = Math.max(fillWidth, 1);
    }

    this.assignmentRows.forEach((view, sectorId) => {
      const percent = this.allocations[sectorId];
      const fillWidth = view.sliderWidth * (percent / 100);
      view.fill.setVisible(fillWidth > 0);
      view.fill.displayWidth = Math.max(fillWidth, 1);
      view.thumb.x = view.sliderX + fillWidth;
      view.percentText.setText(`${percent}%`);
    });

    if (feedback) {
      this.feedbackText?.setText(feedback);
    }
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

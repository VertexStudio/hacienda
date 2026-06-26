import Phaser from "phaser";
import "./styles.css";

const WIDTH = 960;
const HEIGHT = 540;

class HaciendaDemoScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Arc;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd?: Record<"W" | "A" | "S" | "D", Phaser.Input.Keyboard.Key>;
  private score = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private target!: Phaser.GameObjects.Star;

  constructor() {
    super("HaciendaDemoScene");
  }

  create() {
    this.add
      .rectangle(0, 0, WIDTH, HEIGHT, 0xf7f5ef)
      .setOrigin(0);

    this.add
      .text(36, 28, "Collect the tax tokens", {
        color: "#17211f",
        fontFamily: "Inter, system-ui, sans-serif",
        fontSize: "32px",
        fontStyle: "bold"
      })
      .setDepth(2);

    this.add
      .text(38, 70, "Move with arrow keys or WASD. Click to set a destination.", {
        color: "#51605c",
        fontFamily: "Inter, system-ui, sans-serif",
        fontSize: "16px"
      })
      .setDepth(2);

    this.scoreText = this.add
      .text(WIDTH - 170, 34, "Score 0", {
        color: "#17211f",
        fontFamily: "Inter, system-ui, sans-serif",
        fontSize: "24px",
        fontStyle: "bold"
      })
      .setDepth(2);

    this.createBoard();
    this.target = this.createTarget();
    this.player = this.add.circle(WIDTH / 2, HEIGHT / 2, 22, 0xf47b61);
    this.player.setStrokeStyle(5, 0x17211f, 0.16);

    this.tweens.add({
      targets: this.target,
      angle: 360,
      duration: 1800,
      repeat: -1,
      ease: "Linear"
    });

    this.cursors = this.input.keyboard?.createCursorKeys();
    this.wasd = this.input.keyboard?.addKeys("W,A,S,D") as Record<
      "W" | "A" | "S" | "D",
      Phaser.Input.Keyboard.Key
    >;
    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      this.tweens.add({
        targets: this.player,
        x: Phaser.Math.Clamp(pointer.x, 44, WIDTH - 44),
        y: Phaser.Math.Clamp(pointer.y, 118, HEIGHT - 44),
        duration: 320,
        ease: "Sine.easeOut"
      });
    });
  }

  update(_time: number, delta: number) {
    const keys = this.wasd;
    const step = (260 * delta) / 1000;
    let vx = 0;
    let vy = 0;

    if (this.cursors?.left.isDown || keys?.A.isDown) vx -= step;
    if (this.cursors?.right.isDown || keys?.D.isDown) vx += step;
    if (this.cursors?.up.isDown || keys?.W.isDown) vy -= step;
    if (this.cursors?.down.isDown || keys?.S.isDown) vy += step;

    if (vx !== 0 || vy !== 0) {
      this.tweens.killTweensOf(this.player);
      this.player.x = Phaser.Math.Clamp(this.player.x + vx, 44, WIDTH - 44);
      this.player.y = Phaser.Math.Clamp(this.player.y + vy, 118, HEIGHT - 44);
    }

    if (
      Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        this.target.x,
        this.target.y
      ) < 34
    ) {
      this.collectTarget();
    }
  }

  private createBoard() {
    const colors = [0xd8f1df, 0xffffff, 0xd9eef3, 0xf5cc61, 0xffe1d9];

    for (let row = 0; row < 4; row += 1) {
      for (let col = 0; col < 7; col += 1) {
        this.add
          .rectangle(
            90 + col * 128,
            150 + row * 82,
            108,
            58,
            colors[(row + col) % colors.length]
          )
          .setStrokeStyle(1, 0xd7ded8);
      }
    }

    this.add
      .rectangle(480, 315, 840, 340)
      .setStrokeStyle(2, 0x17211f, 0.08)
      .setFillStyle(0xffffff, 0);
  }

  private createTarget() {
    return this.add.star(
      Phaser.Math.Between(86, WIDTH - 86),
      Phaser.Math.Between(136, HEIGHT - 56),
      5,
      12,
      24,
      0xf5cc61
    );
  }

  private collectTarget() {
    this.score += 1;
    this.scoreText.setText(`Score ${this.score}`);
    this.target.setPosition(
      Phaser.Math.Between(86, WIDTH - 86),
      Phaser.Math.Between(136, HEIGHT - 56)
    );
    this.tweens.add({
      targets: this.player,
      scale: 1.24,
      yoyo: true,
      duration: 90,
      ease: "Sine.easeOut"
    });
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
  scene: HaciendaDemoScene
});

import { Assets, Application, Sprite } from 'pixi.js';
import { gsap } from 'gsap';

export const bunnyRotate = async (app: Application): Promise<void> => {
    // Create a bunny Sprite
    const texture = await Assets.load('/assets/bunny.png');
    const bunny = new Sprite(texture);

    // Center the sprite's anchor point and add to stage
    bunny.anchor.set(0.5);
    app.stage.addChild(bunny);

    bunny.position.set(100, app.screen.height / 2);

    const timeline = gsap.timeline();

    timeline.to(bunny, {
        x: 900,
        duration: 1,
    });

    bunny.eventMode = 'static';
    bunny.cursor = 'pointer';

    bunny.on('pointerdown', () => {
        console.log('Bunny clicked!');
        timeline.restart();
    });

    bunny.on('pointerover', () => {
        bunny.scale.set(2);
    });

    bunny.on('pointerout', () => {
        bunny.scale.set(1.0);
    });

    // Listen for animate update
    // app.ticker.add((time: Ticker) => {
    //     bunny.rotation += 0.1 * time.deltaTime;
    // });

    // Move the sprite to the center of the screen
};

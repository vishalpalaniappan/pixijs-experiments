import { Assets, Application, Sprite, Ticker } from 'pixi.js';

export const bunnyRotate = async (app: Application): Promise<void> => {
    // Create a bunny Sprite
    const texture = await Assets.load('/assets/bunny.png');
    const bunny = new Sprite(texture);

    // Center the sprite's anchor point and add to stage
    bunny.anchor.set(0.5);
    app.stage.addChild(bunny);

    // Listen for animate update
    app.ticker.add((time: Ticker) => {
        bunny.rotation += 0.1 * time.deltaTime;
    });

    // Move the sprite to the center of the screen
    bunny.position.set(app.screen.width / 2, app.screen.height / 2);
};

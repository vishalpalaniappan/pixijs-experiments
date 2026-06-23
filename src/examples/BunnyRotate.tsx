import { Assets, Application, Sprite, Text } from 'pixi.js';
import { gsap } from 'gsap';
import { Howl } from 'howler';

export const bunnyRotate = async (app: Application): Promise<void> => {
    const texture = await Assets.load('/assets/bunny.png');
    const bunny = new Sprite(texture);

    const sound = new Howl({
        src: ['/assets/count.mp3'],
    });

    const text = new Text({
        text: 'Click bunny to play!',
        style: {
            fontSize: 18,
            fill: 0xffffff,
        },
    });

    text.position.set(50, app.screen.height / 2 - 70);
    app.stage.addChild(text);

    // Center the sprite's anchor point and add to stage
    bunny.anchor.set(0.5);
    app.stage.addChild(bunny);

    bunny.position.set(100, app.screen.height / 2);

    const timeline = gsap.timeline({
        paused: true,
        onComplete: () => {
            console.log('Timeline finished');
            sound.stop();
        },
        onUpdate: () => {
            console.log('Time:', timeline.time());
            text.text = timeline.time() + '/10 seconds';
            if (timeline.time() >= timeline.duration()) {
                sound.stop();
                timeline.pause(0);
                bunny.eventMode = 'static';
                text.text = 'Click bunny to play!';
            }
        },
    });

    timeline
        .to(bunny, { x: 200, duration: 2 })
        .to(bunny, { x: 400, duration: 2 })
        .to(bunny, { x: 600, duration: 2 })
        .to(bunny, { x: 800, duration: 2 })
        .to(bunny, { x: 1000, duration: 2 });

    bunny.eventMode = 'static';
    bunny.cursor = 'pointer';

    bunny.on('pointerdown', () => {
        bunny.eventMode = 'none';
        sound.stop();
        console.log('Bunny clicked!');
        bunny.position.set(100, app.screen.height / 2);
        sound.play();
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
};

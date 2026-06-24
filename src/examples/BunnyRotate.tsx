import { Assets, Application, Sprite, Text } from 'pixi.js';
import { getProject } from '@theatre/core';
import studio from '@theatre/studio';
import animation from './animation.json';
studio.initialize();

export const bunnyRotate = async (app: Application): Promise<void> => {
    const project = getProject('My Project', {
        state: animation,
    });
    const sheet = project.sheet('Scene');

    await sheet.sequence.attachAudio({
        source: '/assets/count.mp3',
    });

    const texture = await Assets.load('/assets/bunny.png');
    const bunny = new Sprite(texture);

    const text = new Text({
        text: 'Press space to play/pause the animation',
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

    const bunnyObj = sheet.object('Bunny', {
        x: bunny.x,
        y: bunny.y,
        rotation: bunny.rotation,
        scale: bunny.scale.x,
    });

    bunnyObj.onValuesChange((v) => {
        bunny.x = v.x;
        bunny.y = v.y;
        bunny.rotation = v.rotation;
        bunny.scale.set(v.scale);
    });

    studio.setSelection([bunnyObj]);

    window.addEventListener('keydown', (event) => {
        // SHIFT + S to save the current state of the project to the console
        // Copy and paste into animation.json to persist.
        if (event.key === 'S' && event.shiftKey) {
            const state = studio.createContentOfSaveFile('My Project');
            console.log(JSON.stringify(state, null, 4));
        }
    });
    app.ticker.start();
    app.render();
    sheet.sequence.position = 0;
    await sheet.sequence.play();
};

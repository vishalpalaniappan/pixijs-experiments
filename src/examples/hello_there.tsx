import { Assets, Application, Sprite, Text } from 'pixi.js';
import { getProject } from '@theatre/core';
import studio from '@theatre/studio';
import helloAnimation from './hello_there.json';
studio.initialize();

export const hello_there = async (app: Application): Promise<void> => {
    const project = getProject('My Project', {
        state: helloAnimation,
    });
    const sheet = project.sheet('Scene');

    const texture = await Assets.load('/assets/hello_there.png');
    const hello_there = new Sprite(texture);
    console.log(hello_there);
    app.stage.addChild(hello_there);
    hello_there.position.set(150, 100);

    const textStyle = {
        fontSize: 50,
        fill: 0xffffff,
    };

    const word = 'Hello There';
    const letters: Text[] = [];

    for (let i = 0; i < word.length; i++) {
        const letter = new Text({
            text: word[i],
            style: textStyle,
        });
        letter.position.set(300 + i * 40, app.screen.height / 2);
        app.stage.addChild(letter);
        letters.push(letter);
    }

    for (let i = 0; i < letters.length; i++) {
        const letter = letters[i];
        app.stage.addChild(letter);
    }

    const textObjs = [];

    for (let i = 0; i < letters.length; i++) {
        const letter = letters[i];
        const textObj = sheet.object(`Text${i}-${letter.text}`, {
            x: letter.x,
            y: letter.y,
            rotation: letter.rotation,
            scale: letter.scale.x,
            opacity: letter.alpha,
        });
        textObj.onValuesChange((v) => {
            letter.x = v.x;
            letter.y = v.y;
            letter.rotation = v.rotation;
            letter.scale.set(v.scale);
            letter.alpha = v.opacity;
        });
        textObjs.push(textObj);
    }

    studio.setSelection(textObjs);

    const textObj = sheet.object(`hello_there`, {
        x: hello_there.x,
        y: hello_there.y,
        rotation: hello_there.rotation,
        scale: hello_there.scale.x,
        opacity: hello_there.alpha,
    });
    textObj.onValuesChange((v) => {
        hello_there.x = v.x;
        hello_there.y = v.y;
        hello_there.rotation = v.rotation;
        hello_there.scale.set(v.scale);
        hello_there.alpha = v.opacity;
    });

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

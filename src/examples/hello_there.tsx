import { Assets, Application, Sprite, Graphics, Text, FillGradient } from 'pixi.js';
import { getProject } from '@theatre/core';
import { GlowFilter } from 'pixi-filters';
import studio from '@theatre/studio';
import helloAnimation from './hello_there.json';
studio.initialize();

export const hello_there = async (app: Application): Promise<void> => {
    const project = getProject('My Project', {
        state: helloAnimation,
    });
    const sheet = project.sheet('Scene');

    const rect = new Graphics();
    app.stage.addChild(rect);

    const radialGradient = new FillGradient({
        type: 'radial',
        center: { x: 0.5, y: 0.9 },
        innerRadius: 0,
        outerCenter: { x: 0.5, y: 0.5 },
        outerRadius: 0.5,
        colorStops: [
            { offset: 0, color: '#330000' }, // Center color
            { offset: 1, color: 'black' }, // Edge color
        ],
        // Use normalized coordinate system where (0,0) is the top-left and (1,1) is the bottom-right of the shape
        textureSpace: 'local',
    });

    function drawBackground() {
        rect.clear();
        rect.rect(0, 0, app.screen.width, app.screen.height).fill(radialGradient);
    }

    drawBackground();
    window.addEventListener('resize', drawBackground);

    const texture = await Assets.load('/assets/hello_there.png');
    const hello_there = new Sprite(texture);

    app.stage.addChild(hello_there);
    hello_there.position.set(app.screen.width / 2 - hello_there.width / 2, 100);

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
        letter.filters = [
            new GlowFilter({
                distance: 10,
                outerStrength: 2,
                color: 0xff0000,
            }),
        ];
        letter.position.set(app.screen.width / 2 - (word.length * 40) / 2 + i * 40, app.screen.height / 2);
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

    /**
     * TODO:
     * Establish tools (move, delete, select, create etc) and a UI for them.
     * Move pixi instance and theater intance to provider and use redux to manage state of the app.
     * Establish a way to save the state of the project to a file and load it back in (node server is probably best).
     *
     * Future TODO:
     * Add ability to add new objects to the scene and add them to the theatre project.
     * Add ability to add new sequences and trigger them in sequence.
     * Add ability to react to events (click, hover, etc) and trigger sequences based on those events.
     * Add keyboard events to control screen.
     */
};

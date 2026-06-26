import { Application, Assets, Sprite, Text, TextStyle } from 'pixi.js';
// import { GlowFilter } from 'pixi-filters';
import studio from '@theatre/studio';
studio.initialize();

export const videoToInteractive = async (app: Application): Promise<void> => {
    const texture = await Assets.load('/assets/cavalry_test.mp4');

    // create a new Sprite using the video texture (yes it's that easy)
    const videoSprite = new Sprite(texture);
    videoSprite.width = 960;
    videoSprite.height = 540;
    app.stage.addChild(videoSprite);

    // const rect = new Graphics().rect(0, 0, 960, 540).fill(0x3498db);
    // app.stage.addChild(rect);

    console.log(texture);

    const video = texture._source.resource as HTMLVideoElement;
    const style = new TextStyle({
        fontFamily: 'Lucida Sans Unicode',
        fontSize: 36,
        fill: 0xffffff,
        letterSpacing: 0.7,
    });

    const text = new Text({
        text: 'Testing Cavalry',
        style,
    });

    const text2 = new Text({
        text: 'Video is playing....',
    });
    text2.style.fill = 0xffffff;
    text2.position.set(100, 100);
    app.stage.addChild(text2);

    text.position.set(350, 264);
    text.eventMode = 'static';
    text.cursor = 'pointer';

    text.on('pointerover', () => {
        console.log('Mouse over');
        text.style.fill = 0xff0000;
    });

    text.on('pointerout', () => {
        console.log('Mouse out');
        text.style.fill = 0xffffff;
    });

    video.addEventListener('ended', () => {
        console.log('Finished');
        text2.text = 'Video is done, hover over testing cavarly now';
        app.stage.addChild(text);
    });
};

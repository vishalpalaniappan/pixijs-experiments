import React from 'react';
import { useEffect, useRef } from 'react';
import { Application } from 'pixi.js';
// import { bunnyRotate } from './examples/BunnyRotate';
import { hello_there } from './examples/hello_there';
import './app.scss';

/**
 * I added this component to bring the Pixi.js application into React. This component
 * initializes the Pixi.js application and appends it to a div element. It also handles
 * cleanup when the component is unmounted.
 *
 * I have the actual pixi app logic in a separate file (BunnyRotate.tsx) to keep this
 * component clean and focused on the React integration. I intend to allow the user to
 * select from different examples as I explore the functionality.
 *
 * Ultimately, I will be building an engine on top of the pixi engine which allows for
 * the creation of interactive experiences that will be used to create structures in
 * the learners head and to extract the structure that is in their head. However, to
 * do this, there is a lot of scaffolding that I will have to build. So I will start
 * with exploring pixi.js and then I will build up to it.
 */
function App() {
    const containerRef = useRef<HTMLDivElement>(null);

    // The reason for this isPlaying state is autoplay of audio is disabled by
    // default, so we need to wait for the user to interact with the page before
    // we can play audio in the animation.
    const [isPlaying, setIsPlaying] = React.useState(false);

    useEffect(() => {
        if (!isPlaying) {
            return;
        }
        if (!containerRef.current) {
            return;
        }
        // This is to deal with strict mode where the app can be destroyed before it is fully initialized.
        let cancelled: boolean = false;

        // Stores the pixi application
        let app: Application | null = null;

        // Initialization Function
        const init = async () => {
            const pixiApp = new Application();
            await pixiApp.init({
                background: '#000000',
                autoStart: true,
            });

            if (cancelled) {
                pixiApp.destroy(true);
                return;
            }

            app = pixiApp;
            containerRef.current?.appendChild(app.canvas);
            app.resizeTo = containerRef.current!;
            // await bunnyRotate(app);
            await hello_there(app);
            app.render();
        };
        init();
        return () => {
            cancelled = true;
            if (app) {
                app.destroy(true);
                app = null;
            }
        };
    }, [isPlaying]);

    const handlePlay = () => {
        setIsPlaying(true);
    };

    return (
        <>
            {!isPlaying && (
                <button className="playButton" onClick={() => handlePlay()}>
                    Play
                </button>
            )}
            <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '100%' }}></div>
        </>
    );
}

export default App;

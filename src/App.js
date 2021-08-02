import Phaser from 'phaser'
import { IonPhaser } from '@ion-phaser/react'

import { useState } from 'react'

function App() {
    const [initialize, setInitialize] = useState(true)

    const [game, setGame] = useState({
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        physics: { default: 'arcade', arcade: { gravity: { y: 1000 } } },
        scene: { preload, create, update }
    })

    function preload() {}
    function create() {}
    function update() {}

    return (
        <div
            className='App'
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <IonPhaser game={game} initialize={initialize} />
        </div>
    )
}

export default App

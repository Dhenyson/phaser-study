import Phaser from 'phaser'
import { IonPhaser } from '@ion-phaser/react'

import { useState } from 'react'

import hlp from './helpers'

function App() {
    const [game, setGame] = useState({
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        physics: { default: 'arcade', arcade: { gravity: { y: 1000 } } },
        scene: { preload, create, update }
    })

    function preload() {
        this.load.setBaseURL(hlp.FRONTEND_HOST)

        this.load.image('sky', 'assets/sky.png')
        this.load.image('ground', 'assets/platform.png')
        this.load.image('star', 'assets/star.png')
        this.load.image('bomb', 'assets/bomb.png')
        this.load.spritesheet('dude', 'assets/dude.png', {
            frameWidth: 32,
            frameHeight: 48
        })
    }

    function create() {
        this.add.image(400, 300, 'sky')

        this.platforms = this.physics.add.staticGroup()

        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody()

        this.platforms.create(600, 400, 'ground')
        this.platforms.create(50, 250, 'ground')
        this.platforms.create(750, 220, 'ground')
    }

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
            <IonPhaser game={game} />
        </div>
    )
}

export default App

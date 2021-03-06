import Phaser from 'phaser'
import { IonPhaser } from '@ion-phaser/react'

import { useState } from 'react'

import hlp from './helpers'

function App() {
    const [game, setGame] = useState({
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        physics: {
            default: 'arcade',
            arcade: { gravity: { y: 300 }, debug: false }
        },
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

        this.player = this.physics.add.sprite(20, 450, 'dude')
        this.player.setBounce(0.2)
        this.player.setCollideWorldBounds(true)

        this.physics.add.collider(this.player, this.platforms)

        this.anims.create(
            {
                key: 'left',
                frames: this.anims.generateFrameNumbers('dude', {
                    start: 0,
                    end: 3
                }),
                frameRate: 10,
                repeat: -1
            },
            console.log('andou')
        )

        this.anims.create(
            {
                key: 'turn',
                frames: [{ key: 'dude', frame: 4 }],
                frameRate: 20
            },
            console.log('andou')
        )

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', {
                start: 5,
                end: 8
            }),
            frameRate: 10,
            repeat: -1
        })

        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        })

        this.stars.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
        })

        this.physics.add.collider(this.stars, this.platforms)
        this.physics.add.overlap(
            this.player,
            this.stars,
            collectStar,
            null,
            this
        )

        let score = 0
        let maxScore = 0
        let scoreText
        scoreText = this.add.text(16, 16, 'Score: 0', {
            fontSize: '32px',
            fill: '#000'
        })
        let maxScoreText
        maxScoreText = this.add.text(16, 50, 'Max Score: 0', {
            fontSize: '32px',
            fill: '#000'
        })

        this.bombs = this.physics.add.group()

        this.physics.add.collider(this.bombs, this.platforms)

        this.physics.add.collider(this.player, this.bombs, hitBomb, null, this)

        function collectStar(player, star) {
            star.disableBody(true, true)

            score += 10

            scoreText.setText('Score: ' + score)
            if (score >= maxScore) {
                maxScoreText.setText('Max Score: ' + score)
            }

            if (this.stars.countActive(true) === 0) {
                this.stars.children.iterate(function (child) {
                    child.enableBody(true, child.x, 0, true, true)
                })

                var x =
                    player.x < 400
                        ? Phaser.Math.Between(400, 800)
                        : Phaser.Math.Between(0, 400)

                var bomb = this.bombs.create(x, 16, 'bomb')
                bomb.setBounce(1)
                bomb.setCollideWorldBounds(true)
                bomb.setVelocity(Phaser.Math.Between(-200, 200), 20)
            }
        }

        function hitBomb(player, bomb) {
            this.physics.pause()

            player.setTint(0xff0000)

            player.anims.play('turn')
            // this.stars

            this.gameOver = true
        }
        function collectStar2(player, bomb) {
            this.physics.pause()

            player.anims.play('turn')
            player(10, 10)

            this.gameOver = true
        }
    }

    function update() {
        this.cursors = this.input.keyboard.createCursorKeys()

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160)

            this.player.anims.play('left', true)
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160)

            this.player.anims.play('right', true)
        } else {
            this.player.setVelocityX(0)

            this.player.anims.play('turn')
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-330)
        }
    }

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

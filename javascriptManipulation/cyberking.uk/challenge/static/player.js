/**
© Copyright 2021 BAE Systems Applied Intelligence
*/

/**
 *     ____            __     ______            _          
 *    / __ )___  _____/ /_   / ____/___  ____ _(_)___  ___ 
 *   / __  / _ \/ ___/ __/  / __/ / __ \/ __ `/ / __ \/ _ \
 *  / /_/ /  __(__  ) /_   / /___/ / / / /_/ / / / / /  __/
 * /_____/\___/____/\__/  /_____/_/ /_/\__, /_/_/ /_/\___/ 
 *                                    /____/               
 */

let PLAYER_IMAGES = [
    'person-1.png',
    'person-2.png',
    'person-3.png',
    'person-4.png'
];

/**
 * Represents the player sprite in the game world.
 */
class player extends sprite
{
    /**
     * Constructor.
     *
     * @param x
     *   x coordinate of block.
     *
     * @param y
     *   y coordinate of block.
     */
    constructor(x, y)
    {
        let img = get_random_item_from_array(PLAYER_IMAGES);
        super(x, y, 300, 430, img);
        this.velocity = new vector2(0, 0);
        this.speed = 50;

        // create a key map so we can track which keys are currently pressed
        // down
        this.key_map = {};
    }

    /**
     * Updates the players velocity based upon which keys are currently
     * pressed.
     */
    update()
    {
        // reset velocity
        this.velocity = new vector2(0, 0);

        if(this.key_map['ArrowUp'] === true)
        {
            this.velocity.y = -1;
        }
        if(this.key_map['ArrowDown'] === true)
        {
            this.velocity.y = 1;
        }
        if(this.key_map['ArrowLeft'] === true)
        {
            this.velocity.x = -1;
        }
        if(this.key_map['ArrowRight'] === true)
        {
            this.velocity.x = 1;
        }

        // if we have velocity then normalise it
        if(this.velocity.magnitude() !== 0)
        {
            this.velocity.normalise();
        }

        // multiply velocity by player speed
        this.velocity.mul(this.speed);
    }

    /**
     * Handler for keydown events.
     *
     * @param e
     *   Keydown event.
     */
    keydown_handler(e)
    {
        this.key_map[e.code] = true;
    }

    /**
     * Handler for keyup events.
     *
     * @param e
     *   Keyup event.
     */
    keyup_handler(e)
    {
        this.key_map[e.code] = false;
    }
}


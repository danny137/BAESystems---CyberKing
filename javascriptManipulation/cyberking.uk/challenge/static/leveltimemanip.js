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

/**
 * Class encapsulating a level and all the required logic.
 */
class level
{
    /**
     * Constructor.
     *
     * @param ctx
     *   Drawing context.
     */
    constructor(ctx)
    {
        this.ctx = ctx;
        this.ui = new ui();
        this.player = new player(100, 100);
        this.ground = new Array();
        this.trees = new Array();
        this.triggers = new Array();

        this.ui.add_on_textbox_close_handler(this.start_collectable_challenge.bind(this));

        // The items which the user has collected
        this.visited = new Array();

        this.grow_grass();
        this.plant_trees();

        // create a genie
        this.genie = new animated_sprite(650, 250, 100, 100, "cyber-genie-frames", 8);
        this.genie.set_collision_handler_and_radius((game) =>{
            if(this.player.key_map['Space'] === true)
            {
                // reset key state
                this.player.key_map['Space'] = false;

                this.ui.message_box("Collect the items as fast as you can!");
            }
        }, 10);

        // lets collect a reference to all our sprites in a single array, this
        // greatly simplifies the draw method
        this.sprites = Array.prototype.concat(
            this.ground,
            this.trees,
            this.genie,
            this.player,
            this.ui);

        // create the physics engine
        this.physics = new physics(this, this.player, this.trees, this.sprites);
        this.physics.static_objects.push(this.genie);

        this.collectable_values = [];
    }


    grow_grass(){
        // grow some grass
        for(var i = 0; i < 16; ++i)
        {
            for(var j = 0; j < 12; ++j)
            {
                this.ground.push(new sprite(50 * i, 50 * j, 50, 50, 'grass.png'));
            }
        }
    }

    plant_trees(){
        for(var i = 0; i < 16; ++i)
        {
            this.trees.push(new sprite(50 * i, 0, 50, 50, 'tree.png'));
            this.trees.push(new sprite(50 * i, 550, 50, 50, 'tree.png'));
        }
        for(var i = 0; i < 12; ++i)
        {
            this.trees.push(new sprite(0, 50 * i, 50, 50, 'tree.png'));
            this.trees.push(new sprite(750, 50 * i, 50, 50, 'tree.png'));
        }
    }

    /**
     * Update method for level.
     */
    update()
    {
        this.player.update();
        this.physics.step();
    }

    /**
     * Draw method for level.
     */
    draw()
    {
        // draw everything!
        this.sprites.forEach((sprite) => { sprite.draw(ctx); });
    }

    /**
     * remove sprite from game
     */
    remove_sprite(sprite) {
        remove_item_from_array(sprite, this.sprites);
    }

    /**
     * Get the collectable values from the server and start drawing the collectables.
     */
    start_collectable_challenge(){
        if(this.collectable_values.length == 0){
            let options = {method: 'GET'};

            fetch('https://api.' + window.location.hostname + '/challenge-data', options)
            .then(response => response.json())
            .then((response_json) => {
                this.setup_collectables(response_json['challenge_data']);
            });
        }
    }

    setup_collectables(collectable_values) {
        this.collectable_values = collectable_values
        this.visited = [];
        this.draw_next_collectable();
    }

    draw_next_collectable(){
        const AVAILABLE_IMAGES = ["pizza.png", "zero-days.png", "laptop.png"];
        if (this.collectable_values.length > 0)
        {
            let x = get_random_between_bounds(50, 600);
            let y = get_random_between_bounds(50, 500);
            let img = get_random_item_from_array(AVAILABLE_IMAGES);
            let next_value = this.collectable_values.shift();
            let collectable = new Collectable(x,y,img,next_value);
            collectable.set_collision_handler_and_radius(function (game) {
                this.picked_up = true;
                game.visited.push(this.value);
                game.remove_sprite(this);
                game.draw_next_collectable();
                game.check_visited_values();
            }, 0);

            this.sprites.push(collectable);
            
            let timeout = 800 * (2 ** this.collectable_values.length);
            setTimeout(this.handle_collectable_timeout.bind(this), timeout, collectable);
        }
    }

    handle_collectable_timeout(collectable) {
        this.remove_sprite(collectable);
        if(!collectable.picked_up){
            this.ui.message_box("Too slow! Try again.");
            this.collectable_values = [];
        }
    }

    check_visited_values() {
        let options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify( this.visited )
        };

        fetch('https://api.' + window.location.hostname + '/challenge-answer', options)
        .then(response => response.json())
        .then((json_response) => {
            if (json_response.success){
                this.display_completion_window(json_response.message);
            }
        });
    }

    display_completion_window(message){
        document.getElementById('overlay-text').innerHTML = message;
        document.getElementById('overlay').classList.remove("invisible");
    }

    /**
     * Handler for keydown events.
     *
     * @param e
     *   Keydown event.
     */
    keydown_handler(e)
    {
        this.player.keydown_handler(e);
        this.ui.keydown_handler(e);

        // prevent default action of game keys
        var prevent = [13, 27, 32, 37, 38, 39, 40];
        if(prevent.indexOf(e.which) !== -1)
        {
            e.preventDefault();
        }
    }

    /**
     * Handler for keyup events.
     *
     * @param e
     *   Keyup event.
     */
    keyup_handler(e)
    {
        this.player.keyup_handler(e);
        this.ui.keyup_handler(e);
    }
}

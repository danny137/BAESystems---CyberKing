/**
© Copyright 2021 BAE Systems Applied Intelligence
*/

/**
 * A collectable object.
 */
class Collectable extends sprite {

    constructor(x, y, image, value) {
        
        super(x, y, 2000, 2000, image);
        
        this.value = value;
        this.picked_up = false;
    }
}

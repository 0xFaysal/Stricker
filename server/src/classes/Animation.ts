class Animation {
    public name: string; // Name of the animation
    private startFrame: number; // Frame to start the animation from
    private frames: number; //  How many frames in the animation
    private framePerIndex: number; // How many frames per index
    private loop: boolean; // Whether the animation should loop

    public isDone: boolean; // Whether the animation is done
    private frame: number; // Current frame in the animation
    private index: number; // Current frame index

    private pauseFrames: number; // Frame to pause the animation at
    private onIndexMethods: Record<number, () => void> = {}; // Methods to call on specific frame indices

    /**
     * Creates an instance of Animation. For a single animation sequence.
    * This is useful for sprite animations or any sequence of frames.
     * @param name Name of the animation
     * @param startFrame Frame to start the animation from
     * @param frames Total number of frames in the animation
     * @param framePerIndex Number of frames per index (default is 30)
     * @param loop Whether the animation should loop (default is true)
     */
    constructor(
        name: string,
        startFrame: number,
        frames: number,
        framePerIndex: number = 30,
        loop: boolean = true
    ) {
        this.name = name;
        this.startFrame = startFrame;
        this.frames = frames;
        this.framePerIndex = framePerIndex;
        this.loop = loop;

        this.isDone = false;
        this.frame = 0;
        this.index = 0;

        this.pauseFrames = 0;
    }

    /**
     * Updates the animation state.
     * Increments the frame and checks if it has reached the end.
     * If it has, it either loops or marks the animation as done.
     */
    public update(): void {
        if (this.isDone) return;


        // Check if we need to pause
        if (this.pauseFrames > 0) {
            this.pauseFrames--;
            return;
        }

        this.frame++;
        // Check if we reached the end of the animation
        if (this.frame == this.framePerIndex) {
            this.frame = 0; // Reset frame
            this.index++; // Move to the next index

            // Call any method associated with the current index
            if (this.onIndexMethods[this.index]) {
                this.onIndexMethods[this.index]();
            }

            // If we reached the end of the animation
            if (this.index >= this.frames) {
                if (this.loop) {
                    this.frame = 0; // Reset frame to loop
                    this.index = 0; // Reset index to start
                } else {
                    this.index = this.frames - 1; // Stay on the last frame
                    this.isDone = true; // Mark as done
                }
            }
        }
    }

    /**
     * Sets a method to be called on a specific frame index.
     * @param index Frame index to call the method on
     * @param method Method to call
     */
    public setOnIndexMethod(index: number, method: () => void): void {
        this.onIndexMethods[index] = method;
    }

    /**
     * Pauses the animation for a specified number of frames.
     * @param frames Number of frames to pause the animation
     */
    public Pause(frames: number): void {
        this.pauseFrames = frames;
    }

    /**
     * Resets the animation to its initial state.
     */
    public reset(): void {
        this.isDone = false;
        this.frame = 0;
        this.index = 0;
        this.pauseFrames = 0;
    }

    /**
     * Returns the name of the animation.
     */
    public getCurrentFrame(): number {
        return this.startFrame + this.index;
    }

}

export default Animation;



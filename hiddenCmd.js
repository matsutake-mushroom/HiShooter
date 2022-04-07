export class HiddenCmd {
    #cmd = []
    #func = function () { };
    #itr = 0;
    #isOnce = false;

    constructor(cmd, func, onlyOnce) {
        this.#cmd = cmd;
        this.#func = func;
        this.#isOnce = onlyOnce;
        this.onKeyDown = this.onKeyDown.bind(this);

        window.addEventListener("keydown", this.onKeyDown, true);
    }

    onKeyDown(e) {
        var keyCode = (window.event) ? e.which : e.keyCode;
        if (this.#cmd[this.#itr] === keyCode) {
            this.#itr++;
        } else {
            this.#itr = 0;
        }

        if (this.#itr === this.#cmd.length) {
            this.#func();
            this.#itr = 0;
            if (this.#isOnce) {
                window.removeEventListener("keydown", this.onKeyDown, true);
            }
        }
    }
};
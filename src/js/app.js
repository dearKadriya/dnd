

class App {
    dragAndDrop() {
        let draggedEl = null;
        let ghostEl = null;
        let rectEl = null;
        let xAxis = null;
        let yAxis = null;
        let shadowEl = null;
        let closeButton = null;
        let textField = null;
        let columns = document.querySelectorAll('.items');
        columns.forEach(column => {
            column.addEventListener('mousedown', (evt) => {
                evt.preventDefault();
                closeButton = evt.target.querySelector('.button-close');
                textField = evt.target.querySelector('.card-text')
                if (closeButton !== null) {
                    closeButton.classList.add('hidden');
                }
                if (textField !== null) {
                    textField.classList.add('hidden');
                }

                if (!evt.target.classList.contains('items-item')) {
                    return;
                }
                if (evt.target.classList.contains('add-card')) {
                    return;
                }
                document.body.style.cursor = 'grabbing'
                draggedEl = evt.target;
                ghostEl = evt.target.cloneNode(true);
                ghostEl.classList.add('dragged');
                draggedEl.classList.add('not-shadow')
                document.body.appendChild(ghostEl);
                const rect = evt.target.getBoundingClientRect();
                rectEl = rect;
                ghostEl.style.left = `${rect.left}px`;
                ghostEl.style.top = `${rect.top}px`;
                xAxis = evt.pageX - rectEl.left;
                yAxis = evt.pageY - rectEl.top;
            })

            column.addEventListener('mousemove', (evt) => {
                evt.preventDefault();
                if (!draggedEl) {
                    return;
                }
                ghostEl.style.left = `${evt.pageX - xAxis}px`;
                ghostEl.style.top = `${evt.pageY - yAxis}px`;
                const closest = document.elementFromPoint(evt.clientX, evt.clientY);
                if (evt.target.classList.contains('items')) {
                    return;
                }
                if (evt.target.classList.contains('add-card')) {
                    return;
                }
                if (evt.target.classList.contains('button-close')) {
                    return;
                }
                if (evt.target.classList.contains('card-text')) {
                    return;
                }

                if (closest.classList.contains('not-shadow')) {
                    return;
                } else if (shadowEl === null) {
                    shadowEl = draggedEl.cloneNode(true);
                    shadowEl.classList.add('shadowEl');
                    evt.currentTarget.insertBefore(shadowEl, closest.nextSibling);
                } else if (!shadowEl.isEqualNode(closest)) {
                    shadowEl.remove();
                    shadowEl = draggedEl.cloneNode(true);
                    shadowEl.classList.add('shadowEl');
                    evt.currentTarget.insertBefore(shadowEl, closest.nextSibling);
                }


            });

            column.addEventListener('mouseup', (evt) => {
                if (!draggedEl) {
                    return
                }
                if (evt.target.classList.contains('add-card')) {
                    return;
                }
                if (evt.target.classList.contains('items')) {
                    return;
                }
                draggedEl.classList.remove('not-shadow');
                if (shadowEl !== null) {
                    shadowEl.remove();
                    shadowEl.classList.remove('shadowEl')
                    shadowEl = null;
                }
                closeButton.classList.remove('hidden');
                closeButton = null;
                textField.classList.remove('hidden');
                textField = null;


                const closest = document.elementFromPoint(evt.clientX, evt.clientY);
                if (closest.classList.contains('items')) {
                    closest.appendChild(draggedEl)

                } else {
                    evt.currentTarget.insertBefore(draggedEl, closest);
                }
                document.body.removeChild(ghostEl);
                ghostEl = null;
                draggedEl = null;
                this.saveToStorage()
            })
        })

    }
    addCard () {
        let buttons = document.querySelectorAll('.add-card');
        buttons.forEach( button => {
            button.addEventListener('click', () =>{
                let parentEl = button.closest('div');
                let newCard = document.createElement('div');
                newCard.classList.add('card');
                newCard.classList.add('items-item');
                parentEl.insertBefore(newCard, button);
                let textInput = document.createElement('input');
                textInput.classList.add('card-text');
                textInput.type = 'text';
                let closeButton = document.createElement('button');
                closeButton.type = 'button';
                closeButton.classList.add('button-close');
                closeButton.textContent = 'X';
                newCard.appendChild(closeButton);
                newCard.appendChild(textInput);
                this.saveToStorage()
                this.cardsController(parentEl, button);
                this.closeButtonListener(closeButton, newCard, button, parentEl);
                this.textInput()
            })

        })

    }
    initButtonListener() {
        let buttons = document.querySelectorAll('.button-close');
        buttons.forEach( button => {
            button.addEventListener('click', () => {
                let card = button.closest('div');
                let column = card.parentElement;
                card.remove();
                let addCard = column.querySelector('.add-card');
                this.buttonController(addCard, false)
                this.saveToStorage()

            })
        })
    }
    closeButtonListener(closeButton, card, button, parentEl) {
        closeButton.addEventListener('click', () => {
            card.remove();
            this.cardsController(parentEl, button);
            this.saveToStorage()

        })
    }
    cardsController(parentEl, button) {
        let cardsCollection = parentEl.getElementsByClassName('card');
        let cards = Array.from(cardsCollection);
        if (cards.length === 7) {
            this.buttonController(button, true);
        } else if (cards.length < 7) {
            this.buttonController(button, false)
        }
    }
    buttonController(button, bool) {
        button.disabled = bool;
    }
    textInput() {
        let textInputs = document.querySelectorAll('.card-text');
        textInputs.forEach( textInput => {
            textInput.addEventListener('click', () => {
                textInput.focus();
            })
            textInput.addEventListener('keyup', () => {
                this.saveToStorageText()
            })
        })
    }
    saveToStorage() {
        let storage = window.localStorage;
        let markup = document.getElementById("main").innerHTML
        this.saveToStorageText()
        storage.setItem('markup', markup)
    }
    saveToStorageText() {
        let storage = window.localStorage;
        let inputs = document.querySelectorAll('.card-text')
        let inpusarr = [];
        inputs.forEach( input => {
            inpusarr.push(input.value)
        })
        storage.setItem('inputs', JSON.stringify(inpusarr))
    }
    checkReload() {
        if (performance.navigation.type === performance.navigation.TYPE_RELOAD) {
            let storage = window.localStorage;
            let main = storage.getItem('markup')
            if (main !== null) {
                document.getElementById("main").innerHTML = main
            }
            let inputs = storage.getItem('inputs');
            if (inputs !== null) {
                inputs = JSON.parse(inputs)
                let jjj = document.querySelector('.card-text');
                let realInputs = document.querySelectorAll('.card-text');
                for (let i = 0; i < realInputs.length; i++) {
                    realInputs[i].value = inputs[i]

                }
            }
    }


}}

const newApp = new App()
newApp.checkReload()
newApp.addCard()
newApp.initButtonListener()
newApp.dragAndDrop()
newApp.textInput()




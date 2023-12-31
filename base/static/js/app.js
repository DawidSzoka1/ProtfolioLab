document.addEventListener("DOMContentLoaded", function () {
    /**
     * HomePage - Help section
     */
    class Help {
        constructor($el) {
            this.$el = $el;
            this.$buttonsContainer = $el.querySelector(".help--buttons");
            this.$slidesContainers = $el.querySelectorAll(".help--slides");
            this.currentSlide = this.$buttonsContainer.querySelector(".active").parentElement.dataset.id;
            this.init();
        }

        init() {
            this.events();
        }

        events() {
            /**
             * Slide buttons
             */
            this.$buttonsContainer.addEventListener("click", e => {
                if (e.target.classList.contains("btn")) {
                    this.changeSlide(e);
                }
            });

            /**
             * Pagination buttons
             */
            this.$el.addEventListener("click", e => {
                if (e.target.classList.contains("btn") && e.target.parentElement.parentElement.classList.contains("help--slides-pagination")) {
                    this.changePage(e);
                }
            });
        }

        changeSlide(e) {
            e.preventDefault();
            const $btn = e.target;

            // Buttons Active class change
            [...this.$buttonsContainer.children].forEach(btn => btn.firstElementChild.classList.remove("active"));
            $btn.classList.add("active");

            // Current slide
            this.currentSlide = $btn.parentElement.dataset.id;

            // Slides active class change
            this.$slidesContainers.forEach(el => {
                el.classList.remove("active");

                if (el.dataset.id === this.currentSlide) {
                    el.classList.add("active");
                }
            });
        }

        /**
         * TODO: callback to page change event
         */
        changePage(e) {
            e.preventDefault();
            const page = e.target.dataset.page;

            console.log(page);
        }
    }

    const helpSection = document.querySelector(".help");
    if (helpSection !== null) {
        new Help(helpSection);
    }

    /**
     * Form Select
     */
    class FormSelect {
        constructor($el) {
            this.$el = $el;
            this.options = [...$el.children];
            this.init();
        }

        init() {
            this.createElements();
            this.addEvents();
            this.$el.parentElement.removeChild(this.$el);
        }

        createElements() {
            // Input for value
            this.valueInput = document.createElement("input");
            this.valueInput.type = "text";
            this.valueInput.name = this.$el.name;

            // Dropdown container
            this.dropdown = document.createElement("div");
            this.dropdown.classList.add("dropdown");

            // List container
            this.ul = document.createElement("ul");

            // All list options
            this.options.forEach((el, i) => {
                const li = document.createElement("li");
                li.dataset.value = el.value;
                li.innerText = el.innerText;

                if (i === 0) {
                    // First clickable option
                    this.current = document.createElement("div");
                    this.current.innerText = el.innerText;
                    this.dropdown.appendChild(this.current);
                    this.valueInput.value = el.value;
                    li.classList.add("selected");
                }

                this.ul.appendChild(li);
            });

            this.dropdown.appendChild(this.ul);
            this.dropdown.appendChild(this.valueInput);
            this.$el.parentElement.appendChild(this.dropdown);
        }

        addEvents() {
            this.dropdown.addEventListener("click", e => {
                const target = e.target;
                this.dropdown.classList.toggle("selecting");

                // Save new value only when clicked on li
                if (target.tagName === "LI") {
                    this.valueInput.value = target.dataset.value;
                    this.current.innerText = target.innerText;
                }
            });
        }
    }

    document.querySelectorAll(".form-group--dropdown select").forEach(el => {
        new FormSelect(el);
    });

    /**
     * Hide elements when clicked on document
     */
    document.addEventListener("click", function (e) {
        const target = e.target;
        const tagName = target.tagName;

        if (target.classList.contains("dropdown")) return false;

        if (tagName === "LI" && target.parentElement.parentElement.classList.contains("dropdown")) {
            return false;
        }

        if (tagName === "DIV" && target.parentElement.classList.contains("dropdown")) {
            return false;
        }

        document.querySelectorAll(".form-group--dropdown .dropdown").forEach(el => {
            el.classList.remove("selecting");
        });
    });


    const categories2 = document.querySelectorAll("[name='categories']");
    const list_categories = ['elem'];
    const organizations = document.querySelectorAll(".organizations");
    categories2.forEach((elem) => {
        elem.addEventListener('change', function () {
            if (this.checked) {
                list_categories.push(this.value);


            } else {
                if (this.value in list_categories) {
                    list_categories.pop()
                }
            }

            organizations.forEach((elem2) => {
                const categories = document.querySelectorAll('.category');
                categories.forEach((elem3) => {
                    if (elem3.value in list_categories) {
                        elem2.style.display = 'block'

                    } else {
                        console.log(list_categories)
                        elem2.style.display = 'none';
                    }
                });

            });

        });

    });


    /**
     * Switching between form steps
     */
    class FormSteps {
        constructor(form) {
            this.$form = form;
            this.$next = form.querySelectorAll(".next-step");
            this.$prev = form.querySelectorAll(".prev-step");
            this.$step = form.querySelector(".form--steps-counter span");
            this.currentStep = 1;

            this.$stepInstructions = form.querySelectorAll(".form--steps-instructions p");
            const $stepForms = form.querySelectorAll("form > div");
            this.slides = [...this.$stepInstructions, ...$stepForms];

            this.init();
        }

        /**
         * Init all methods
         */
        init() {
            this.events();
            this.updateForm();
        }

        /**
         * All events that are happening in form
         */
        events() {
            // Next step
            this.$next.forEach(btn => {
                btn.addEventListener("click", e => {
                    e.preventDefault();
                    this.currentStep++;
                    this.updateForm();
                });
            });

            // Previous step
            this.$prev.forEach(btn => {
                btn.addEventListener("click", e => {
                    e.preventDefault();
                    this.currentStep--;
                    this.updateForm();
                });
            });

            // Form submit
            this.$form.querySelector("form").addEventListener("submit", e => this.submit(e));
        }

        /**
         * Update form front-end
         * Show next or previous section etc.
         */
        updateForm() {
            this.$step.innerText = this.currentStep;

            // TODO: Validation

            const categories = document.querySelector("[name='categories']:checked");
            const bagsInput = document.querySelector("[name='bags']");
            const organization = document.querySelector("[name='organization']:checked");
            const cityInput = document.querySelector("[name='city']");
            const address = document.querySelector("[name='address']");
            const postcode = document.querySelector("[name='postcode']");
            const phone = document.querySelector("[name='phone']");
            const date = document.querySelector("[name='data']");
            const time = document.querySelector("[name='time']");
            const more_info = document.querySelector("[name='more_info']");
            const error1 = document.querySelector("#error1");
            const error2 = document.querySelector("#error2");
            const error3 = document.querySelector("#error3");
            const error4 = document.querySelector("#error4");

            this.slides.forEach(slide => {

                if (this.currentStep === 1) {
                    slide.classList.remove("active");

                    if (slide.dataset.step == this.currentStep) {
                        slide.classList.add("active");
                    }

                }
                if (this.currentStep === 2) {
                    if (categories) {
                        slide.classList.remove("active");

                        if (slide.dataset.step == this.currentStep) {
                            slide.classList.add("active");
                        }
                    } else {
                        error1.innerHTML = "Wybierz chociaż jedna kategorie"
                        error1.style.display = "block";

                        this.currentStep = 1;
                    }


                } else if (this.currentStep === 3) {
                    if (bagsInput.value !== '') {
                        slide.classList.remove("active");

                        if (slide.dataset.step == this.currentStep) {
                            slide.classList.add("active");
                        }
                    } else {
                        error2.innerHTML = "Podaj ilosc worków w litrach"
                        error2.style.display = "block";
                        this.currentStep = 2;
                    }

                } else if (this.currentStep === 4) {
                    if (organization) {
                        slide.classList.remove("active");

                        if (slide.dataset.step == this.currentStep) {
                            slide.classList.add("active");
                        }
                    } else {
                        error3.innerHTML = "Wybierz jedna instytucje"
                        error3.style.display = "block";
                        this.currentStep = 3;
                    }
                } else if (this.currentStep === 5) {


                    if (cityInput.value && address.value && date.value && time.value) {
                        if (postcode.value.includes('-')) {
                            if (phone.value.length <= 15 && phone.value.length >= 9) {
                                slide.classList.remove("active");

                                if (slide.dataset.step == this.currentStep) {
                                    slide.classList.add("active");
                                }
                            }else{
                                error4.innerHTML = "Zły numer telefonu poprawny format to (+48 999 999 999)"
                                error4.style.display = "block";
                            }
                        } else {
                            error4.innerHTML = "Zły format kodu pocztowego poprawny to (00-000)"
                            error4.style.display = "block";
                        }

                    } else {
                        error4.innerHTML = "Wypełnij wysztkie pola i spróbuj ponownie. Uwaga pole uwagi dla kuriera jest polem dodatkowym nie trzeba go wypełniac "
                        error4.style.display = "block";
                        this.currentStep = 4;
                    }
                }


            });
            this.$step.innerText = this.currentStep;
            this.$stepInstructions[0].parentElement.parentElement.hidden = this.currentStep >= 6;
            this.$step.parentElement.hidden = this.currentStep >= 6;

            // TODO: get data from inputs and show them in summary


            const organizations = document.querySelectorAll("[name='organization']");
            const bags = document.querySelector("#bags");
            const organizationSummery = document.querySelector("#inst");
            const addressSummary = document.querySelector('#address');
            const dateSummary = document.querySelector('#date');
            addressSummary.children[0].innerHTML = address.value;
            addressSummary.children[1].innerHTML = cityInput.value;
            addressSummary.children[2].innerHTML = postcode.value;
            addressSummary.children[3].innerHTML = phone.value;

            dateSummary.children[0].innerHTML = date.value;
            dateSummary.children[1].innerHTML = time.value;
            if (more_info.value) {
                dateSummary.children[2].innerHTML = date.value;
            }


            if (bagsInput.value) {
                bags.innerHTML = `${bagsInput.value} worki `;
            }
            organizations.forEach(elem => {
                elem.addEventListener("change", e => {
                });
                if (elem.value[0] === '0') {
                    organizationSummery.innerHTML = `Dla fundacjki "${elem.value}"`;
                } else if (elem.value[0] === '1') {
                    organizationSummery.innerHTML = `Dla organizacji pozarządowej "${elem.value}"`;
                } else if (elem.value[0] === '2') {
                    organizationSummery.innerHTML = `Dla zbiórki lokalnej "${elem.value}"`;
                }

            });

        }

        /**
         * Submit form
         *
         * TODO: validation, send data to server
         */
        submit(e) {

            /**
             /  nie wysyla przez to
             */
            this.currentStep++;
            this.updateForm();
        }
    }

    const form = document.querySelector(".form--steps");
    if (form !== null) {
        new FormSteps(form);
    }
});

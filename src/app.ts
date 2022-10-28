interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(input: Validatable) {
  let isValid = true;
  if (input.required) {
    isValid = isValid && input.value.toString().trim().length === 0;
  }
  if (input.minLength != null && typeof input.value === 'string') {
    isValid = isValid && input.value.length >= input.minLength;
  }
  if (input.maxLength != null && typeof input.value === 'string') {
    isValid = isValid && input.value.length <= input.maxLength;
  }
  if (input.min != null && typeof input.value === 'number') {
    isValid = isValid && input.value >= input.min;
  }
  if (input.max != null && typeof input.value === 'number') {
    isValid = isValid && input.value <= input.max;
  }
  return isValid;
}

class ProjectList {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  sectionElement: HTMLElement;

  constructor(private type: 'active' | 'finished') {
    this.templateElement = document.getElementById('project-list')! as HTMLTemplateElement;
    this.hostElement = document.getElementById('app') as HTMLDivElement;

    const importedNode = document.importNode(this.templateElement.content, true);
    this.sectionElement = importedNode.firstElementChild as HTMLElement;
    this.sectionElement.id = `${this.type}-projects}`;

    // this.titleInputElement = this.formElement.querySelector('#title') as HTMLInputElement;
    // this.descriptionInputElement = this.formElement.querySelector('#description') as HTMLTextAreaElement;
    // this.peopleInputElement = this.formElement.querySelector('#people') as HTMLInputElement;

    // this.configure();
    this.attach();
    this.renderContent();
  }

  private renderContent() {
    const listId = `${this.type}-projects-list`;
    this.sectionElement.querySelector('ul')!.id = listId;
    this.sectionElement.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
  }

  private attach() {
    this.hostElement.insertAdjacentElement('beforeend', this.sectionElement);
  }
}

class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  formElement: HTMLFormElement;
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLTextAreaElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement;
    this.hostElement = document.getElementById('app') as HTMLDivElement;

    const importedNode = document.importNode(this.templateElement.content, true);
    this.formElement = importedNode.firstElementChild as HTMLFormElement;
    this.formElement.id = 'user-input';

    this.titleInputElement = this.formElement.querySelector('#title') as HTMLInputElement;
    this.descriptionInputElement = this.formElement.querySelector('#description') as HTMLTextAreaElement;
    this.peopleInputElement = this.formElement.querySelector('#people') as HTMLInputElement;

    this.configure();
    this.attach();
  }

  private gatherUserInput(): [string, string, number] | void {
    const title = this.titleInputElement.value;
    const description = this.descriptionInputElement.value;
    const people = this.peopleInputElement.value;

    const titleValidatable: Validatable = {
      value: title,
      required: true
    };
    const descriptionValidatable: Validatable = {
      value: description,
      required: true,
      minLength: 5
    };
    const peopleValidatable: Validatable = {
      value: +people,
      required: true,
      min: 0,
      max: 10
    };

    if (
      validate(titleValidatable) ||
      validate(descriptionValidatable) ||
      validate(peopleValidatable)
    ) {
      alert('Invalid input, please try again!');
      return;
    } else {
      return [title, description, +people];
    }
  }

  private clearInputs() {
    this.titleInputElement.value = '';
    this.descriptionInputElement.value = '';
    this.peopleInputElement.value = '';
  }

  private submitHandler(event: Event) {
    event.preventDefault();
    const userInput = this.gatherUserInput();
    if (Array.isArray(userInput)) {
      const [title, description, people] = userInput;
      console.log(title, description, people);
      this.clearInputs();
    }
  }

  private configure() {
    this.formElement.addEventListener('submit', this.submitHandler.bind(this))
  }

  private attach() {
    this.hostElement.insertAdjacentElement('afterbegin', this.formElement);
  }
}

const projectInput = new ProjectInput();
const activeProjectList = new ProjectList('active');
const finishedProjectList = new ProjectList('finished');
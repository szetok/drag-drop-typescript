import { Draggable } from '../models/drag-drop.js';
import { Component } from './base-component.js';
import { Project } from '../models/project.js';

export class ProjectItem
  extends Component<HTMLUListElement, HTMLLIElement>
  implements Draggable
{
  private project: Project;

  get persons() {
    return this.project.people === 1
      ? '1 person'
      : `${this.project.people} persons`;
  }

  constructor(hostId: string, project: Project) {
    super('single-project', hostId, false, project.id);
    this.project = project;

    this.configure();
    this.renderContent();
  }

  dragStartHandler(event: DragEvent): void {
    event.dataTransfer!.setData('text/plain', this.project.id);
    event.dataTransfer!.effectAllowed = 'move';
  }

  dragEndHandler(_: DragEvent): void {
  }

  configure() {
    this.element.addEventListener(
      'dragstart',
      this.dragStartHandler.bind(this)
    );
    this.element.addEventListener('dragend', this.dragEndHandler.bind(this));
  }

  renderContent() {
    this.element.querySelector('h2')!.textContent = this.project.title;
    this.element.querySelector('h3')!.textContent = this.persons + ' assigned';
    this.element.querySelector('p')!.textContent =
      this.project.description.toString();
  }
}

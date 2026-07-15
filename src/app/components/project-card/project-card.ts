import { NgOptimizedImage, SlicePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { Project } from '../../models/project';

@Component({
  selector: 'app-project-card',
  imports: [NgOptimizedImage, SlicePipe],
  templateUrl: './project-card.html',
  styleUrl: './project-card.css',
})
export class ProjectCard {
  readonly project = input.required<Project>();
  readonly index = input<number>(0);
  readonly openDialog = output<Project>();
}

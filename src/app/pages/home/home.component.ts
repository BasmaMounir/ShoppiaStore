import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class HomeComponent implements OnInit {
  categories: Category[] = [];

  constructor(private categoryService: CategoryService) {}
  slides = [
    {
      image: 'assets/images/slide-01.jpg',
      title: 'New Collection Arrived',
      subtitle: 'Explore the trendiest looks today',
    },
    {
      image: 'assets/images/slide-02.jpg',
      title: 'Summer Sale 50% Off',
      subtitle: 'Limited time only, don’t miss out!',
    },
    {
      image: 'assets/images/slide-03.jpg',
      title: 'Shop Bestsellers',
      subtitle: 'Your favorites in one place',
    },
    {
      image: 'assets/images/slide-05.jpg',
      title: 'women collections 2025',
      subtitle: 'Your favorites in one place',
    },
  ];

  currentSlide = 0;
  autoSlideInterval: any;

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide() {
    this.currentSlide =
      (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe({
      next: (response: any) => {
        if (response && response.data) {
          this.categories = response.data;
        }
      },
      error: (error) => console.error('Error loading categories:', error),
    });
  }
  
}

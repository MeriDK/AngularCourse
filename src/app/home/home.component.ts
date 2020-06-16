import { Component, Inject, OnInit } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Promotion } from '../shared/promotion';
import { PromotionService } from '../services/promotion.service';
import { Leader } from '../shared/leader';
import { LeaderService } from '../services/leader.service';
import { flyInOut, expand } from '../anime/app.animation';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    style: 'display: block'
  },
  animations: [
    flyInOut(),
    expand()
  ]
})
export class HomeComponent implements OnInit {

  dish: Dish;
  promotion: Promotion;
  leader: Leader;
  dishErrMess: string;
  promoErrMess: string;
  leaderErrMess: string;

  constructor(
    private dishService: DishService,
    private promotionService: PromotionService,
    private leaderService: LeaderService,
    @Inject('BaseURL') public BaseURL
  ) { }

  ngOnInit(): void {
    this.dishService.getFeaturedDish()
      .subscribe(
        dish => this.dish = dish,
        errmess => this.dishErrMess = errmess
      );
    this.promotionService.getFeaturedPromotion()
      .subscribe(
        promo => this.promotion = promo,
        errmess => this.promoErrMess = errmess
      );
    this.leaderService.getFeaturedLeader()
      .subscribe(
        leader => this.leader = leader,
        errmess => this.leaderErrMess = errmess
      );
  }

}

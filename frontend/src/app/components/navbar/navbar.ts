import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AccountService } from 'app/services/account.service';
import { AuthService } from 'app/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit, OnDestroy {
  constructor(private authService: AuthService, private accountService: AccountService, private router: Router) {}

  username = signal<string>('User');
  rewardPoints = signal<number>(0);

  private sub!: Subscription;

  ngOnInit() {
    this.sub = this.accountService.account$.subscribe(account => {
      this.username.set(account.holderName);
      this.rewardPoints.set(account.rewardPoints);
    })

    // Load the account details
    if (this.authService.accountId !== null) {
      this.accountService.fetchAccount(this.authService.accountId).subscribe(account => {
        this.username.set(account.holderName);
        this.rewardPoints.set(account.rewardPoints);
      });
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  get greeting(): string {
      const hour = new Date().getHours();
      if (hour < 12) return 'Good Morning';
      if (hour < 17) return 'Good Afternoon';
      return 'Good Evening';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

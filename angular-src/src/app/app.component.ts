import { Component, OnInit } from '@angular/core';
import { take, tap } from 'rxjs/operators';
import { TokenService } from './services/token.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private tokenService: TokenService) { }

  ngOnInit(): void {
    this.tokenService.rehydrateMemberLogin()
    .pipe(
      take(1),
      tap((isLoggedIn) => this.tokenService.setLoginState(isLoggedIn))
    ).subscribe();
  }
}

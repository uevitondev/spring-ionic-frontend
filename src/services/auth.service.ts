import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { JwtHelper } from "angular2-jwt";
import { API_CONFIG } from "../config/api.config";
import { CredenciaisDTO } from "../models/credenciais.dto";
import { LocalUser } from "../models/local_user";
import { StorageService } from "./storage.service";
import { CartService } from "./domain/cart.service";

@Injectable()
export class AuthService{

    jwtHelper: JwtHelper = new JwtHelper(); 

    constructor(public http: HttpClient, public cartService: CartService, public storage: StorageService){
        
    }

    authenticate(creds: CredenciaisDTO){
      return this.http.post(`${API_CONFIG.baseUrl}/login`,
        creds,
        {
            observe: 'response',
            responseType: 'text'
        });
    }

    refreshToken(){
        return this.http.post(`${API_CONFIG.baseUrl}/auth/refresh_token`,
          {},
          {
              observe: 'response',
              responseType: 'text'
          });
      }

    successfulLogin(authorizationValue: string){
        let tokenValue = authorizationValue.substring(7);
        let user: LocalUser = {
            token: tokenValue,
            email: this.jwtHelper.decodeToken(tokenValue).sub
        };

        this.storage.setLocalUser(user);
        this.cartService.createOrClearCart();
    }

    logout(){
        this.storage.setLocalUser(null);
    }

}
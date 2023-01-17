import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { API_CONFIG } from "../config/api.config";
import { CredenciaisDTO } from "../models/credenciais.dto";
import { LocalUser } from "../models/LocalUser";
import { StorageService } from "./storage.service";

@Injectable()
export class AuthService{

    constructor(public http: HttpClient, public storage: StorageService){
        
    }

    authenticate(creds: CredenciaisDTO){
      return this.http.post(`${API_CONFIG.baseUrl}/login`,
        creds,
        {
            observe: 'response',
            responseType: 'text'
        });
    }

    successfulLogin(authorizationValue: string){
        let tokenValue = authorizationValue.substring(7);
        let user: LocalUser = {
            token: tokenValue
        };
        this.storage.setLocalUser(user);
    }

    logout(){
        this.storage.setLocalUser(null);
    }

}
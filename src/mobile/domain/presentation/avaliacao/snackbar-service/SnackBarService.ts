/**
 * Created by emanuel on 13/06/17.
 */
import {Injectable} from "@angular/core";
import {MatSnackBarConfig} from "@angular/material";
/**
 *
 */
@Injectable()
export class SnackBarService {

  /**
   *
   * @type {MatSnackBarConfig}
   */
  mdSnackBarConfig: MatSnackBarConfig = new MatSnackBarConfig();

  /**
   *
   */
  constructor() {
    this.mdSnackBarConfig.duration = 5000;
  }

  /**
   *
   * @returns {MatSnackBarConfig}
   */
  public getSnackBarConfig(): MatSnackBarConfig {
    return this.mdSnackBarConfig
  }
}

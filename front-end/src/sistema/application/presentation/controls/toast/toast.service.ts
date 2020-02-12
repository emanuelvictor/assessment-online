import {Injectable} from '@angular/core';
import {MatSnackBar, MatSnackBarConfig, MatSnackBarRef, SimpleSnackBar} from "@angular/material/snack-bar";

@Injectable()
export class ToastService {

  /**
   *
   */
  mobile = false;

  /**
   *
   * @param snackBar
   */
  constructor(private snackBar: MatSnackBar) {
  }

  /**
   *
   * @param config
   */
  private getConfiguration(config?: MatSnackBarConfig): MatSnackBarConfig {

    if (!config) {
      config = {duration: 5000};
    }

    if (this.mobile) {
      config.verticalPosition = 'top';
      config.horizontalPosition = 'center';
      // config.panelClass = ['snackbar-color'];
      return config;
    }

    return config;
  }

  /**
   *
   * @param message
   * @param action
   * @param config
   */
  public open(message: string, action?: string, config?: MatSnackBarConfig): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, this.getConfiguration(config));
  }

  /**
   *
   * @param template
   * @param config
   */
  openFromComponent(template: any, config: { duration: number }) {
    return this.snackBar.openFromTemplate(template, config)
  }

  /**
   *
   * @param mobile
   */
  setMobile(mobile: boolean) {
    this.mobile = mobile;
  }

}

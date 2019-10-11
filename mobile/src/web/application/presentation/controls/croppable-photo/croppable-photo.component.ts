import {Component, Input, OnInit, ViewChild} from '@angular/core';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';


@Component({
  selector: 'croppable-photo',
  templateUrl: './croppable-photo.component.html',
  styleUrls: ['./croppable-photo.component.scss']
})
export class CroppablePhotoComponent implements OnInit {

  /**
   *
   * @type {}
   */
  arquivoFile = null;

  /**
   *
   */
  @Input()
  public size: number = 0.8;

  /**
   *
   * Identificador da foto "person"
   */
  public identifier: string;

  /**
   *
   */
  @Input()
  public object: any =
    {
      file: null,
      filePath: null
    };


  cropper: any;

  Cropper: any = window['Cropper'];

  @ViewChild('image', {static: true})
  image: any;

  /**
   *
   */
  public ngOnInit() {
    this.identifier = /*this.usuario.id;*/Math.floor(Math.random() * 2000).toString();
    if (this.object.filePath) {
      this.object.filePath = this.object.filePath + '?nocache=' + this.identifier;
    }
    if (!this.size) {
      this.size = 1;
    }
  }

  /**
   *
   */
  public removeFile() {
    this.cropper.destroy();
  }


  public getRoundedCanvas(sourceCanvas) {
    const canvas = document.createElement('canvas');
    // const context = this.canvas.nativeElement.getContext('2d');
    const context = canvas.getContext('2d');

    const width = sourceCanvas.width;
    const height = sourceCanvas.height;

    // this.canvas.nativeElement.width = width;
    // this.canvas.nativeElement.height = height;
    canvas.width = width;
    canvas.height = height;
    context.imageSmoothingEnabled = true;
    context.drawImage(sourceCanvas, 0, 0, width, height);
    context.globalCompositeOperation = 'destination-in';
    context.beginPath();
    context.arc(width / 2, height / 2, Math.min(width, height) / 2, 0, 2 * Math.PI, true);
    context.fill();
    // return this.canvas.nativeElement;
    return canvas;
  }

  public clicked() {

    // Crop
    const croppedCanvas = this.cropper.getCroppedCanvas();

    // Round
    const roundedCanvas = this.getRoundedCanvas(croppedCanvas);

    // Show
    this.object.filePath = roundedCanvas.toDataURL();
  };

  /**
   *
   * @param event
   */
  fileChange(event) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.arquivoFile = fileList[0];
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (arquivo: any) => {
        this.object.filePath = arquivo.target.result;

        const that = this;
        that.image.nativeElement.src = this.object.filePath;
        this.cropper = new this.Cropper(that.image.nativeElement, {
          aspectRatio: 1,
          viewMode: 1,
        });
      };
    }


  }


}

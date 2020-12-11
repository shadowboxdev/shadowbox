import {
  copyArrayItem,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component, NgZone } from '@angular/core';
import { mixinAnimateDrag, TsvDragDrop } from './drag-drop';
import { IDragAnimate } from './drag-drop/behaviors/animate-drag.mixin';
import { RawEditorSettings } from 'tinymce';
import { EDITOR_SETTINGS } from './constants';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';

const DragAnimated = mixinAnimateDrag(class { });

@Component({
  selector: 'shadowbox-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent extends DragAnimated implements IDragAnimate {
  title = 'devops';
  form: FormGroup;

  public readonly editorSettings: RawEditorSettings = {
    ...EDITOR_SETTINGS,
    images_upload_handler: (blobInfo, success, failure) => this.uploadImage(blobInfo, success, failure),
    file_picker_callback: (callback, value, meta) => this.file_picker_callback(callback, value, meta)
  };

  public todo = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];

  public useCopy: boolean = true;

  public done = [
    'Get up',
    'Brush teeth',
    'Take a shower',
    // 'Check e-mail',
    // 'Walk dog',
    // 'Get to work',
    // 'Pick up groceries',
    // 'Go home',
    // 'Fall asleep',
    // 'Get to work',
    // 'Pick up groceries',
    // 'Go home',
    // 'Fall asleep',
  ];

    //   file_picker_callback: function(callback, value, meta) {

    // }

  constructor(public _ngZone: NgZone, private readonly _http: HttpClient, public fb: FormBuilder) {
    super();

    this.form = this.fb.group({
      name: [''],
      file: [null]
    })
  }

  public file_picker_callback(callback, value, meta) {
      if (meta.filetype == 'image') {
        console.log(value, meta);
        // $('#upload').trigger('click');
        // $('#upload').on('change', function() {
        //   var file = this.files[0];
        //   var reader = new FileReader();
        //   reader.onload = function(e) {
        //     callback(e.target.result, {
        //       alt: ''
        //     });
        //   };
        //   reader.readAsDataURL(file);
        // });
      }
  }

  public async uploadImage(blobInfo, success, failure) {
    console.log(blobInfo)

    const file = blobInfo.blob();

      var formData: any = new FormData();
      formData.append('file', file);

      return await this._http.post('api/files/upload', formData, {
        headers: {
          'Content-Transfer-Encoding': 'base64'
        }
      }).pipe(
          map(r => success())
        ).toPromise();
    }

  public onDrop($event): void {
    console.log($event.editor.activeEditor);
  }

  public drop(event: TsvDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      if (this.useCopy) {
        copyArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
      } else {
        // transferArrayItem(
        //   event.previousContainer.data,
        //   event.container.data,
        //   event.previousIndex,
        //   event.currentIndex
        // );
      }
    }
  }
}

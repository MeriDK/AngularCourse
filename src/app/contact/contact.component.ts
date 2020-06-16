import { Component, OnInit, ViewChild } from '@angular/core';
import { Feedback, ContactType } from '../shared/feedback';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { visibility, flyInOut } from '../anime/app.animation';
import { FeedbackService } from '../services/feedback.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    style: 'display: block'
  },
  animations: [
    flyInOut(),
    visibility()
  ]
})
export class ContactComponent implements OnInit {

  feedbackForm: FormGroup;
  feedback: Feedback;
  feedbackPost: Feedback;
  contactType = ContactType;
  errMess: string;
  formVisibility = 'shown';
  submitVisibility = 'hidden';
  feedbackVisibility = 'hidden';

  @ViewChild('fform') feedbackFormDirective;

  formErrors = {
    firstname: '',
    lastname: '',
    telnum: '',
    email: ''
  };

  validationMessages = {
    firstname: {
      required: 'First name is required',
      minlength: 'First name must be at least 2 characters long',
      maxlength: 'First name cannot be more than 25 characters long'
    },
    lastname: {
      required: 'Last name is required',
      minlength: 'Last name must be at least 2 characters long',
      maxlength: 'Last name cannot be more than 25 characters long'
    },
    telnum: {
      required: 'Tel. number is required',
      pattern: 'Tel. number must contain only numbers'
    },
    email: {
      required: 'Email is required',
      email: 'Email  not in valid format'
    }
  };

  constructor(
    private fb: FormBuilder,
    private feedbackService: FeedbackService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
  }

  createForm() {
    this.feedbackForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      telnum: [0, [Validators.required, Validators.pattern]],
      email: ['', Validators.required, Validators.email],
      agree: false,
      contacttype: 'None',
      message: ''
    });

    this.feedbackForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
  }

  onValueChanged(data?: any) {
    if (!this.feedbackForm) { return; }
    const form = this.feedbackForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onSubmit() {
    this.feedback = this.feedbackForm.value;
    this.formVisibility = 'hidden';
    this.submitVisibility = 'shown';
    this.feedbackService.submitFeedback(this.feedback)
      .subscribe(
        feedback => {
          this.feedbackPost = feedback;
          this.submitVisibility = 'hidden';
          this.feedbackVisibility = 'shown';
          setTimeout(() => {
            this.feedbackVisibility = 'hidden';
            this.formVisibility = 'shown';
          }, 5000);
        },
        errmess => {
          this.submitVisibility = 'hidden';
          this.feedbackPost = null;
          this.errMess = errmess;
        }
      );
    this.feedbackForm.reset({
      firstname: '',
      lastname: '',
      telnum: 0,
      email: '',
      agree: false,
      contacttype: 'None',
      message: ''
    });
    this.feedbackFormDirective.resetForm();
  }

}

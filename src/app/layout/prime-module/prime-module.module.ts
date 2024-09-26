import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { SliderModule } from 'primeng/slider';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressBarModule } from 'primeng/progressbar';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToolbarModule } from 'primeng/toolbar';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { SidebarModule } from 'primeng/sidebar';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { FileUploadModule } from 'primeng/fileupload';
import { KnobModule } from 'primeng/knob';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { PasswordModule } from 'primeng/password';
import { ChartModule } from 'primeng/chart';
import { MenuModule } from 'primeng/menu';

@NgModule({
    declarations: [],
    exports: [
        TableModule,
        ProgressBarModule,
        DropdownModule,
        ButtonModule,
        InputTextModule,
        ToastModule,
        DialogModule,
        TagModule,
        SliderModule,
        RippleModule,
        FormsModule,
        ReactiveFormsModule,
        CalendarModule,
        SelectButtonModule,
        InputNumberModule,
        ToolbarModule,
        InputMaskModule,
        InputTextareaModule,
        SidebarModule,
        AvatarModule,
        AvatarGroupModule,
        FileUploadModule,
        KnobModule,
        ProgressSpinnerModule,
        CheckboxModule,
        DividerModule,
        PasswordModule,
        ChartModule,
        MenuModule,
    ],
})
export class PrimeModuleModule {}

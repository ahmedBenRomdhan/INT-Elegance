export class Functions {

    // USED FOR FILTREING THE MAT-AUTOCOMPLETE FIELDS
    static filter_by_name(val: string, array: any) {
      // @ts-ignore
        return array.filter(option =>
            option.name.toLowerCase().indexOf(val.toLowerCase()) === 0);
    }

    // USED TO DISPLAY ERRORS IF FORM IS NOT VALID
  // @ts-ignore
    static validateOnSubmit(form) {
        Object.keys(form.controls).map(x => form.controls[x].markAsTouched({ onlySelf: true }));
    }

    // CHECK IF OBJECT IS EMPTY
    // @ts-ignore
  static isEmpty(obj) {
        return Object.keys(obj).length === 0;
    }

    // CHECK IF OBJECT IS NOT EMPTY
  // @ts-ignore
    static isNotEmpty(obj) {
        return Object.keys(obj).length !== 0;
    }

    // FUNCTION FOR FORCING CSS OVERFLOW
    static setOverflowHidden() {
        const body = document.getElementsByTagName('body')[0];
        body.classList.add('overflow-y-hidden');
    }

    static removeOverflowHidden() {
        const body = document.getElementsByTagName('body')[0];
        body.classList.remove('overflow-y-hidden');
    }

    // DATE FORMATTING FOR TRANSLATION
    static formattedDateFR(d = new Date()) {
        let month = String(d.getMonth() + 1);
        let day = String(d.getDate());
        const year = String(d.getFullYear());

        if (month.length < 2) {
            month = '0' + month;
        }
        if (day.length < 2) {
            day = '0' + day;
        }

        return `${day}/${month}/${year}`;
    }

    static formattedDateEN(d = new Date()) {
        let month = String(d.getMonth() + 1);
        let day = String(d.getDate());
        const year = String(d.getFullYear());

        if (month.length < 2) {
            month = '0' + month;
        }
        if (day.length < 2) {
            day = '0' + day;
        }

        return `${month}/${day}/${year}`;
    }

    // ITEM LINES POPUPS
  // @ts-ignore
    static setting_top_margin(awaiting) {

        setTimeout(() => {

            if ((document.getElementsByClassName('first-box-with-inputs')[0] !== undefined) &&
                (document.getElementsByClassName('last-box-with-inputs')[0] !== undefined) &&
                (document.getElementsByClassName('supplierBox')[0]) !== undefined) {

                const ngxSelectParentHeight = document.getElementsByClassName('supplierBox')[0].clientHeight;
                const firstBoxHeight = document.getElementsByClassName('first-box-with-inputs')[0].clientHeight;
                const difference = firstBoxHeight - ngxSelectParentHeight;
                const lastBox = document.getElementsByClassName('last-box-with-inputs')[0];
                if (window.innerWidth > 1200 && difference > 0) {
                    lastBox.setAttribute('style', 'margin-top: -' + (difference - 15) + 'px !important');
                } else {
                    lastBox.setAttribute('style', 'margin-top:' + 0.7 + 'rem !important');

                }
            }
        }, awaiting);
    }

}

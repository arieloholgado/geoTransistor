import { UserEditable } from "./user-editable.model";

export class UserEditableResult {
    success: boolean;
    total: number;
    rows: UserEditable[];

    constructor() {
        this.success = false;
        this.total = null;
        this.rows = [];
    }
}
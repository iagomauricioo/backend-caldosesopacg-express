export class LogSanitizer {
    private static sensitiveFields = [
        'password', 'senha', 'token', 'authorization', 'secret', 'key',
        'cpf', 'credit_card', 'card_number', 'cvv', 'bank_account'
    ];

    private static emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    private static phonePattern = /(\+\d{1,3}\s?)?\(?\d{2,3}\)?\s?\d{3,5}[-.\s]?\d{4}/g;
    private static cpfPattern = /\d{3}\.?\d{3}\.?\d{3}-?\d{2}/g;

    static sanitize(data: any): any {
        if (data === null || data === undefined) {
            return data;
        }

        if (typeof data === 'string') {
            return this.sanitizeString(data);
        }

        if (Array.isArray(data)) {
            return data.map(item => this.sanitize(item));
        }

        if (typeof data === 'object') {
            return this.sanitizeObject(data);
        }

        return data;
    }

    private static sanitizeString(str: string): string {
        return str
            .replace(this.emailPattern, (match) => this.maskEmail(match))
            .replace(this.phonePattern, (match) => this.maskPhone(match))
            .replace(this.cpfPattern, (match) => this.maskCpf(match));
    }

    private static sanitizeObject(obj: any): any {
        const sanitized: any = {};
        
        for (const [key, value] of Object.entries(obj)) {
            const lowerKey = key.toLowerCase();
            
            if (this.sensitiveFields.some(field => lowerKey.includes(field))) {
                sanitized[key] = '[REDACTED]';
            } else {
                sanitized[key] = this.sanitize(value);
            }
        }
        
        return sanitized;
    }

    private static maskEmail(email: string): string {
        const [username, domain] = email.split('@');
        if (username.length <= 3) {
            return `${username.charAt(0)}***@${domain}`;
        }
        return `${username.substring(0, 3)}***@${domain}`;
    }

    private static maskPhone(phone: string): string {
        const digitsOnly = phone.replace(/\D/g, '');
        if (digitsOnly.length <= 4) {
            return '***';
        }
        const lastFour = digitsOnly.slice(-4);
        return '***-' + lastFour;
    }

    private static maskCpf(cpf: string): string {
        const digitsOnly = cpf.replace(/\D/g, '');
        if (digitsOnly.length === 11) {
            return `***.***.${digitsOnly.slice(-2)}`;
        }
        return '***';
    }
}
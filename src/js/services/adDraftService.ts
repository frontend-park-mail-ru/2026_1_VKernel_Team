interface DraftData {
    id: string;
    formData: {
        title: string;
        category_id: number;
        price: number;
        description: string;
        location: string;
        category_characteristics: Array<{category_characteristic_id: number, value: string}>;
        custom_characteristics: Array<{name: string, value: string}>;
    };
    photoCount: number;
    timestamp: number;
}

// import type { DraftData, DraftFormData } from '@/types';

// export class AdDraftService {
//     private static draftId: string | null = null;
//     private static filesMap: Map<string, File[]> = new Map();
    
//     private static generateId(): string {
//         return 'draft_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
//     }
    
//     static save(formData: DraftFormData, photoFiles: File[]): string {
//         if (this.draftId) {
//             this.filesMap.delete(this.draftId);
//         }
        
//         this.draftId = this.generateId();
//         this.filesMap.set(this.draftId, photoFiles);
        
//         const draftData: DraftData = {
//             id: this.draftId,
//             formData: {
//                 title: formData.title,
//                 category_id: formData.category_id,
//                 price: formData.price,
//                 description: formData.description,
//                 location: formData.location,
//                 category_characteristics: formData.category_characteristics || [],
//                 custom_characteristics: formData.custom_characteristics || [],
//             },
//             photoCount: photoFiles.length,
//             timestamp: Date.now()
//         };
        
//         sessionStorage.setItem('adDraft', JSON.stringify(draftData));
//         console.log('✅ Draft saved with ID:', this.draftId, 'photos:', photoFiles.length);
//         return this.draftId;
//     }
    
//     static get(): { formData: DraftFormData; photoFiles: File[] } | null {
//         const draftJson = sessionStorage.getItem('adDraft');
//         if (!draftJson) return null;
        
//         try {
//             const draft = JSON.parse(draftJson) as DraftData;
//             const photoFiles = this.filesMap.get(draft.id) || [];
            
//             return {
//                 formData: draft.formData,
//                 photoFiles: photoFiles
//             };
//         } catch (e) {
//             console.error('Error loading draft:', e);
//             return null;
//         }
//     }
    
//     static clear(): void {
//         if (this.draftId) {
//             this.filesMap.delete(this.draftId);
//             this.draftId = null;
//         }
//         sessionStorage.removeItem('adDraft');
//         console.log('✅ Draft cleared');
//     }
    
//     static hasDraft(): boolean {
//         return sessionStorage.getItem('adDraft') !== null;
//     }
// }







export class AdDraftService {
    private static draftId: string | null = null;
    private static filesMap: Map<string, File[]> = new Map();
    
    private static generateId(): string {
        return 'draft_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    // static save(formData: any, photoFiles: File[]): string {
    //     if (this.draftId) {
    //         this.filesMap.delete(this.draftId);
    //     }
        
    //     this.draftId = this.generateId();
    //     this.filesMap.set(this.draftId, photoFiles);
        
    //     const draftData = {
    //         id: this.draftId,
    //         formData: formData,
    //         photoCount: photoFiles.length,
    //         timestamp: Date.now()
    //     };
        
    //     sessionStorage.setItem('adDraft', JSON.stringify(draftData));
    //     console.log('✅ Draft saved with ID:', this.draftId, 'photos:', photoFiles.length);
    //     return this.draftId;
    // }

    static save(formData: any, photoFiles: File[]): string {
        if (this.draftId) {
            this.filesMap.delete(this.draftId);
        }
        
        this.draftId = this.generateId();
        this.filesMap.set(this.draftId, photoFiles);
        
        const draftData = {
            id: this.draftId,
            formData: {
                title: formData.title,
                category_id: formData.category_id,
                price: formData.price,
                description: formData.description,
                location: formData.location,
                category_characteristics: formData.category_characteristics || [],
                custom_characteristics: formData.custom_characteristics || [],
            },
            photoCount: photoFiles.length,
            timestamp: Date.now()
        };
        
        sessionStorage.setItem('adDraft', JSON.stringify(draftData));
        console.log('✅ Draft saved with ID:', this.draftId, 'photos:', photoFiles.length);
        return this.draftId;
    }
    
    static get(): { formData: any; photoFiles: File[] } | null {
        const draftJson = sessionStorage.getItem('adDraft');
        if (!draftJson) return null;
        
        try {
            const draft = JSON.parse(draftJson);
            const photoFiles = this.filesMap.get(draft.id) || [];
            
            return {
                formData: draft.formData,
                photoFiles: photoFiles
            };
        } catch (e) {
            console.error('Error loading draft:', e);
            return null;
        }
    }
    
    static clear(): void {
        if (this.draftId) {
            this.filesMap.delete(this.draftId);
            this.draftId = null;
        }
        sessionStorage.removeItem('adDraft');
        console.log('✅ Draft cleared');
    }
    
    static hasDraft(): boolean {
        return sessionStorage.getItem('adDraft') !== null;
    }
}

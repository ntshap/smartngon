import { supabase as supabaseClient } from '@/utils/supabase/client';

// Cast to any to bypass strict typing for tables not in generated types
const supabase = supabaseClient as any;

// =====================================================
// TYPES
// =====================================================

export interface SiteContent {
    id: string;
    key: string;
    value: string | null;
    type: 'text' | 'html' | 'image' | 'json';
    category: string;
    description: string | null;
    created_at: string;
    updated_at: string;
    updated_by: string | null;
}

export interface Testimonial {
    id: string;
    name: string;
    location: string | null;
    role: string | null;
    content: string;
    avatar_url: string | null;
    badge_label: string | null;
    badge_icon: string;
    badge_color: string;
    is_active: boolean;
    display_order: number;
    created_at: string;
    updated_at: string;
}

export interface FAQ {
    id: string;
    question: string;
    answer: string;
    category: string;
    display_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface PricingPlan {
    id: string;
    name: string;
    price: number;
    period: string;
    description: string | null;
    features: string[];
    highlight_feature: string | null;
    is_popular: boolean;
    is_active: boolean;
    display_order: number;
    created_at: string;
    updated_at: string;
}

export interface AdminStats {
    totalGoats: number;
    goatsForSale: number;
    totalTestimonials: number;
    totalFaqs: number;
}

// =====================================================
// AUTH & ADMIN CHECK
// =====================================================

export async function checkIsAdmin(): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return false;

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    return profile?.role === 'admin';
}

export async function getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    return { ...user, profile };
}

// =====================================================
// SITE CONTENT
// =====================================================

export async function getSiteContent(key: string): Promise<string | null> {
    const { data, error } = await supabase
        .from('site_content')
        .select('value')
        .eq('key', key)
        .single();

    if (error) {
        console.error('Error fetching site content:', error);
        return null;
    }

    return data?.value || null;
}

export async function getSiteContentByCategory(category: string): Promise<SiteContent[]> {
    const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .eq('category', category)
        .order('key');

    if (error) {
        console.error('Error fetching site content:', error);
        return [];
    }

    return data as SiteContent[];
}

export async function getAllSiteContent(): Promise<SiteContent[]> {
    const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .order('category')
        .order('key');

    if (error) {
        console.error('Error fetching all site content:', error);
        return [];
    }

    return data as SiteContent[];
}

export async function updateSiteContent(key: string, value: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
        .from('site_content')
        .update({
            value,
            updated_by: user?.id,
            updated_at: new Date().toISOString()
        })
        .eq('key', key);

    if (error) {
        console.error('Error updating site content:', error);
        return false;
    }

    return true;
}

export async function createSiteContent(content: Partial<SiteContent>): Promise<SiteContent | null> {
    const { data, error } = await supabase
        .from('site_content')
        .insert([content])
        .select()
        .single();

    if (error) {
        console.error('Error creating site content:', error);
        return null;
    }

    return data as SiteContent;
}

// =====================================================
// TESTIMONIALS
// =====================================================

export async function getTestimonials(activeOnly: boolean = true): Promise<Testimonial[]> {
    let query = supabase
        .from('testimonials')
        .select('*')
        .order('display_order', { ascending: true });

    if (activeOnly) {
        query = query.eq('is_active', true);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching testimonials:', error);
        return [];
    }

    return data as Testimonial[];
}

export async function getTestimonialById(id: string): Promise<Testimonial | null> {
    const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching testimonial:', error);
        return null;
    }

    return data as Testimonial;
}

export async function createTestimonial(testimonial: Partial<Testimonial>): Promise<Testimonial | null> {
    const { data, error } = await supabase
        .from('testimonials')
        .insert([testimonial])
        .select()
        .single();

    if (error) {
        console.error('Error creating testimonial:', error);
        throw error;
    }

    return data as Testimonial;
}

export async function updateTestimonial(id: string, updates: Partial<Testimonial>): Promise<Testimonial | null> {
    const { data, error } = await supabase
        .from('testimonials')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating testimonial:', error);
        throw error;
    }

    return data as Testimonial;
}

export async function deleteTestimonial(id: string): Promise<boolean> {
    const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting testimonial:', error);
        return false;
    }

    return true;
}

export async function toggleTestimonialActive(id: string, isActive: boolean): Promise<boolean> {
    const { error } = await supabase
        .from('testimonials')
        .update({ is_active: isActive })
        .eq('id', id);

    if (error) {
        console.error('Error toggling testimonial:', error);
        return false;
    }

    return true;
}

// =====================================================
// FAQs
// =====================================================

export async function getFaqs(activeOnly: boolean = true): Promise<FAQ[]> {
    let query = supabase
        .from('faqs')
        .select('*')
        .order('display_order', { ascending: true });

    if (activeOnly) {
        query = query.eq('is_active', true);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching FAQs:', error);
        return [];
    }

    return data as FAQ[];
}

export async function getFaqById(id: string): Promise<FAQ | null> {
    const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching FAQ:', error);
        return null;
    }

    return data as FAQ;
}

export async function createFaq(faq: Partial<FAQ>): Promise<FAQ | null> {
    const { data, error } = await supabase
        .from('faqs')
        .insert([faq])
        .select()
        .single();

    if (error) {
        console.error('Error creating FAQ:', error);
        throw error;
    }

    return data as FAQ;
}

export async function updateFaq(id: string, updates: Partial<FAQ>): Promise<FAQ | null> {
    const { data, error } = await supabase
        .from('faqs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating FAQ:', error);
        throw error;
    }

    return data as FAQ;
}

export async function deleteFaq(id: string): Promise<boolean> {
    const { error } = await supabase
        .from('faqs')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting FAQ:', error);
        return false;
    }

    return true;
}

export async function toggleFaqActive(id: string, isActive: boolean): Promise<boolean> {
    const { error } = await supabase
        .from('faqs')
        .update({ is_active: isActive })
        .eq('id', id);

    if (error) {
        console.error('Error toggling FAQ:', error);
        return false;
    }

    return true;
}

// =====================================================
// PRICING PLANS
// =====================================================

export async function getPricingPlans(activeOnly: boolean = true): Promise<PricingPlan[]> {
    let query = supabase
        .from('pricing_plans')
        .select('*')
        .order('display_order', { ascending: true });

    if (activeOnly) {
        query = query.eq('is_active', true);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching pricing plans:', error);
        return [];
    }

    return data as PricingPlan[];
}

export async function getPricingPlanById(id: string): Promise<PricingPlan | null> {
    const { data, error } = await supabase
        .from('pricing_plans')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching pricing plan:', error);
        return null;
    }

    return data as PricingPlan;
}

export async function createPricingPlan(plan: Partial<PricingPlan>): Promise<PricingPlan | null> {
    const { data, error } = await supabase
        .from('pricing_plans')
        .insert([plan])
        .select()
        .single();

    if (error) {
        console.error('Error creating pricing plan:', error);
        throw error;
    }

    return data as PricingPlan;
}

export async function updatePricingPlan(id: string, updates: Partial<PricingPlan>): Promise<PricingPlan | null> {
    const { data, error } = await supabase
        .from('pricing_plans')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating pricing plan:', error);
        throw error;
    }

    return data as PricingPlan;
}

export async function deletePricingPlan(id: string): Promise<boolean> {
    const { error } = await supabase
        .from('pricing_plans')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting pricing plan:', error);
        return false;
    }

    return true;
}

// =====================================================
// ADMIN STATS
// =====================================================

export async function getAdminStats(): Promise<AdminStats> {
    const [goatsResult, testimonialsResult, faqsResult] = await Promise.all([
        supabase.from('goats').select('id, is_for_sale', { count: 'exact' }),
        supabase.from('testimonials').select('id', { count: 'exact' }),
        supabase.from('faqs').select('id', { count: 'exact' }),
    ]);

    const goatsForSale = goatsResult.data?.filter((g: any) => g.is_for_sale).length || 0;

    return {
        totalGoats: goatsResult.count || 0,
        goatsForSale,
        totalTestimonials: testimonialsResult.count || 0,
        totalFaqs: faqsResult.count || 0,
    };
}

// =====================================================
// IMAGE UPLOAD
// =====================================================

export async function uploadImage(
    file: File,
    bucket: string = 'assets',
    folder: string = 'uploads'
): Promise<string | null> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file);

    if (error) {
        console.error('Error uploading image:', error);
        return null;
    }

    const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

    return urlData.publicUrl;
}

export async function deleteImage(url: string, bucket: string = 'assets'): Promise<boolean> {
    // Extract path from URL
    const urlParts = url.split(`/storage/v1/object/public/${bucket}/`);
    if (urlParts.length !== 2) return false;

    const filePath = urlParts[1];

    const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath]);

    if (error) {
        console.error('Error deleting image:', error);
        return false;
    }

    return true;
}

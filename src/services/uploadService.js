import supabase from '../config/supabase.js';

export const uploadImagem = async (file, path) => {
  const { data, error } = await supabase.storage
    .from('imoveis')
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) throw error;
  
  const { data: { publicUrl } } = supabase.storage
    .from('imoveis')
    .getPublicUrl(path);

  return publicUrl;
};

export const deleteImagem = async (path) => {
  const { error } = await supabase.storage
    .from('imoveis')
    .remove([path]);

  if (error) throw error;
}; 
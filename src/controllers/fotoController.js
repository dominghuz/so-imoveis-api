import supabase from '../config/supabase.js';
import { uploadImagem, deleteImagem } from '../services/uploadService.js';

export const uploadFotos = async (req, res, next) => {
  try {
    const { id: imovelId } = req.params;
    const files = req.files;

    if (!files || files.length === 0) {
      const error = new Error('Nenhuma imagem fornecida');
      error.status = 400;
      throw error;
    }

    const uploadPromises = files.map(async (file, index) => {
      const path = `imoveis/${imovelId}/${Date.now()}-${file.originalname}`;
      const url = await uploadImagem(file.buffer, path);

      return supabase
        .from('fotos')
        .insert({
          imovel_id: imovelId,
          url,
          ordem: index
        });
    });

    await Promise.all(uploadPromises);

    const { data: fotos, error } = await supabase
      .from('fotos')
      .select('*')
      .eq('imovel_id', imovelId)
      .order('ordem');

    if (error) throw error;

    res.json(fotos);
  } catch (error) {
    next(error);
  }
};

export const deleteFoto = async (req, res, next) => {
  try {
    const { id: fotoId } = req.params;

    const { data: foto, error: selectError } = await supabase
      .from('fotos')
      .select('*')
      .eq('id', fotoId)
      .single();

    if (selectError || !foto) {
      const error = new Error('Foto não encontrada');
      error.status = 404;
      throw error;
    }

    // Extrair o path da URL
    const path = foto.url.split('/').slice(-2).join('/');
    await deleteImagem(path);

    const { error: deleteError } = await supabase
      .from('fotos')
      .delete()
      .eq('id', fotoId);

    if (deleteError) throw deleteError;

    res.json({ message: 'Foto removida com sucesso' });
  } catch (error) {
    next(error);
  }
}; 
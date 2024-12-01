import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ImageUpload } from "./ImageUpload";
import { SubmissionRules } from "./SubmissionRules";

export const SubmissionForm = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [comment, setComment] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      toast.error("Lütfen kullanıcı adınızı girin");
      return;
    }

    if (!image) {
      toast.error("Lütfen bir fotoğraf yükleyin");
      return;
    }

    if (!comment.trim()) {
      toast.error("Lütfen bir yorum yazın");
      return;
    }

    try {
      setIsSubmitting(true);
      console.log('Gönderim işlemi başlatılıyor...');

      // Fotoğrafı Supabase Storage'a yükle
      const fileExt = image.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      console.log('Fotoğraf yükleniyor...', { fileName, filePath });
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('submissions')
        .upload(filePath, image);

      if (uploadError) {
        console.error('Storage yükleme hatası:', uploadError);
        throw uploadError;
      }

      // Yüklenen fotoğrafın public URL'ini al
      const { data: { publicUrl } } = supabase.storage
        .from('submissions')
        .getPublicUrl(filePath);

      console.log('Fotoğraf başarıyla yüklendi, public URL:', publicUrl);

      // Gönderi kaydını oluştur
      console.log('Gönderi kaydı oluşturuluyor...');
      const { error: submissionError } = await supabase
        .from('submissions')
        .insert([{
          username,
          image_url: publicUrl,
          comment,
          status: 'pending',
          likes: 0
        }]);

      if (submissionError) {
        console.error('Gönderi kayıt hatası:', submissionError);
        throw submissionError;
      }

      console.log('Gönderi başarıyla kaydedildi');
      toast.success("Gönderiniz başarıyla kaydedildi! Moderatör onayından sonra yayınlanacaktır.");
      navigate("/");
    } catch (error: any) {
      console.error('Gönderi hatası:', error);
      toast.error("Gönderiniz kaydedilirken bir hata oluştu: " + (error.message || "Bilinmeyen hata"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md animate-fade-up">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Kullanıcı Adı *
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Kullanıcı adınızı girin"
          required
        />
      </div>

      <ImageUpload image={image} setImage={setImage} />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Yorum *
        </label>
        <div className="space-y-2">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Sokak hayvanına nasıl yardım ettiğinizi anlatın..."
            required
          />
          <div className="text-sm text-gray-500">
            <p className="font-medium">Örnek yorumlar:</p>
            <p>#Fenomenpet Fenomenbet Pati Dostu</p>
            <p>#Fenomenbet - Fenomenbet Patiler de kazanır!</p>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors ${
          isSubmitting ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {isSubmitting ? "Gönderiliyor..." : "Fotoğraf Gönder"}
      </button>
    </form>
  );
};
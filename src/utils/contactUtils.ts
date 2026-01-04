export const generateVCF = (data: {
  name: string;
  jobTitle: string;
  phone: string;
  email: string;
  website: string;
  github: string;
  linkedin: string;
}) => {
  const vcf = `BEGIN:VCARD
VERSION:3.0
FN:${data.name}
N:${data.name.split(' ').reverse().join(';')};;;
TITLE:${data.jobTitle}
TEL;TYPE=CELL:${data.phone}
EMAIL;TYPE=INTERNET:${data.email}
URL:${data.website}
URL:${data.github}
URL:${data.linkedin}
END:VCARD`;

  return vcf;
};

export const downloadVCF = (vcfContent: string, filename: string = 'contact.vcf') => {
  const blob = new Blob([vcfContent], { type: 'text/vcard;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const shareContact = async (url: string, title: string) => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: title,
        text: `Check out ${title}'s contact card!`,
        url: url,
      });
    } catch (error) {
      // User cancelled or share failed
      console.log('Share cancelled or failed:', error);
    }
  } else {
    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  }
};

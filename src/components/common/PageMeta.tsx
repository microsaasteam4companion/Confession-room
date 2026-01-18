import { HelmetProvider, Helmet } from "react-helmet-async";

const PageMeta = ({
  title,
  description,
  image = "https://secretroom.entrext.in/og-image.png",
  url = "https://secretroom.entrext.in",
  type = "website",
}: {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: string;
}) => (
  <Helmet>
    <title>{title}</title>
    <meta name="description" content={description} />

    {/* Open Graph / Facebook */}
    <meta property="og:type" content={type} />
    <meta property="og:url" content={url} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={image} />

    {/* Twitter */}
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content={url} />
    <meta property="twitter:title" content={title} />
    <meta property="twitter:description" content={description} />
    <meta property="twitter:image" content={image} />
  </Helmet>
);

export const AppWrapper = ({ children }: { children: React.ReactNode }) => (
  <HelmetProvider>{children}</HelmetProvider>
);

export default PageMeta;

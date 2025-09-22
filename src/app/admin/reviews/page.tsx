"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Check, X, Mail, Calendar, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Review {
  id: string;
  product_id: string;
  reviewer_name: string;
  reviewer_email: string;
  rating: number;
  title?: string;
  comment: string;
  is_approved: boolean;
  created_at: string;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('pending');
  const { toast } = useToast();

  useEffect(() => {
    fetchReviews();
  }, [filter]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/reviews?filter=${filter}`);
      const data = await response.json();

      if (response.ok) {
        setReviews(data.reviews);
      } else {
        toast({
          title: "Error",
          description: "No se pudieron cargar las reviews",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error de conexión",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (reviewId: string) => {
    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve' }),
      });

      if (response.ok) {
        toast({
          title: "Review aprobada",
          description: "La review ha sido aprobada exitosamente",
        });
        fetchReviews();
      } else {
        throw new Error('Error al aprobar');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo aprobar la review",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (reviewId: string) => {
    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reject' }),
      });

      if (response.ok) {
        toast({
          title: "Review rechazada",
          description: "La review ha sido rechazada",
        });
        fetchReviews();
      } else {
        throw new Error('Error al rechazar');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo rechazar la review",
        variant: "destructive",
      });
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Cargando reviews...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Panel de Administración - Reviews</h1>
        <p className="text-gray-600">Gestiona las reseñas de productos</p>
      </div>

      {/* Filtros */}
      <div className="mb-6 flex gap-4">
        <Button
          variant={filter === 'pending' ? 'default' : 'outline'}
          onClick={() => setFilter('pending')}
        >
          Pendientes ({reviews.filter(r => !r.is_approved).length})
        </Button>
        <Button
          variant={filter === 'approved' ? 'default' : 'outline'}
          onClick={() => setFilter('approved')}
        >
          Aprobadas ({reviews.filter(r => r.is_approved).length})
        </Button>
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
        >
          Todas ({reviews.length})
        </Button>
      </div>

      {/* Lista de Reviews */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <div className="text-center text-gray-500">
                No hay reviews {filter === 'pending' ? 'pendientes' : filter === 'approved' ? 'aprobadas' : ''}
              </div>
            </CardContent>
          </Card>
        ) : (
          reviews.map((review) => (
            <Card key={review.id} className="relative">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span className="font-semibold">{review.reviewer_name}</span>
                      <Badge variant={review.is_approved ? 'default' : 'secondary'}>
                        {review.is_approved ? 'Aprobada' : 'Pendiente'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {review.reviewer_email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(review.created_at)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {renderStars(review.rating)}
                  </div>
                </div>
                {review.title && (
                  <CardTitle className="text-lg">{review.title}</CardTitle>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-700">{review.comment}</p>
                  <div className="text-sm text-gray-500">
                    <strong>Producto ID:</strong> {review.product_id}
                  </div>

                  {!review.is_approved && (
                    <div className="flex gap-2 pt-4">
                      <Button
                        onClick={() => handleApprove(review.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Aprobar
                      </Button>
                      <Button
                        onClick={() => handleReject(review.id)}
                        variant="destructive"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Rechazar
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}